from fastapi import FastAPI, Depends, HTTPException, status, Request, UploadFile, File
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
import hashlib
import os
import csv
import codecs
import datetime
import shutil
from pathlib import Path
from . import models, schemas, auth, database
from . import email_utils

# Create tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Mether Workspace API")

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Mount static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Analytics Middleware
SALT = os.getenv("ANALYTICS_SALT", "super_secret_salt_value")

@app.middleware("http")
async def analytics_middleware(request: Request, call_next):
    response = await call_next(request)
    
    # Only track GET requests to public API endpoints
    if request.url.path.startswith("/api") and request.method == "GET":
        client_ip = request.client.host if request.client else "unknown"
        ip_hash = hashlib.sha256((client_ip + SALT).encode()).hexdigest()
        
        db = database.SessionLocal()
        try:
            new_entry = models.Analytics(ip_hash=ip_hash, path=request.url.path)
            db.add(new_entry)
            db.commit()
        except Exception as e:
            print(f"Analytics error: {e}")
        finally:
            db.close()
            
    return response

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Auth Routes
@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

# Image Upload
@app.post("/api/upload-image")
async def upload_image(file: UploadFile = File(...), current_user: models.User = Depends(auth.get_current_admin)):
    # Validate file type
    allowed_types = ["image/jpeg", "image/jpg", "image/png"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Only JPEG and PNG images are allowed")
    
    # Generate unique filename
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    file_extension = file.filename.split(".")[-1]
    filename = f"{timestamp}_{file.filename}"
    file_path = UPLOAD_DIR / filename
    
    # Save file
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Return URL
    return {"url": f"http://localhost:8000/uploads/{filename}"}

# Public API
@app.get("/api/stats", response_model=schemas.Stats)
def get_stats(db: Session = Depends(get_db)):
    total_views = db.query(models.Analytics).count()
    unique_visitors = db.query(models.Analytics.ip_hash).distinct().count()
    return {"total_views": total_views, "unique_visitors": unique_visitors}

@app.get("/api/profile", response_model=schemas.Profile)
def get_profile(db: Session = Depends(get_db)):
    profile = db.query(models.Profile).first()
    if not profile:
        return schemas.Profile(id=0, name="Amil Mether", bio="Full Stack Engineer", role="Developer", location="Kochi, Kerala", status="Available", whatsapp="")
    return profile

@app.get("/api/projects", response_model=List[schemas.Project])
def get_projects(featured: bool = False, db: Session = Depends(get_db)):
    query = db.query(models.Project)
    if featured:
        query = query.filter(models.Project.featured == True)
    return query.all()

@app.get("/api/projects/{slug}", response_model=schemas.Project)
def get_project(slug: str, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.slug == slug).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@app.get("/api/services", response_model=List[schemas.Service])
def get_services(db: Session = Depends(get_db)):
    return db.query(models.Service).filter(models.Service.is_active == True).all()

@app.post("/api/contact", response_model=schemas.Message)
def send_message(message: schemas.MessageCreate, db: Session = Depends(get_db)):
    db_message = models.Message(**message.model_dump(), timestamp=datetime.datetime.utcnow())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    # Send email notification
    try:
        email_utils.send_contact_email(
            name=message.name,
            email=message.email,
            message_type=message.type,
            budget=message.budget or "Not specified",
            whatsapp=message.whatsapp or "Not provided",
            message=message.message
        )
    except Exception as e:
        print(f"Failed to send email notification: {e}")
        # Don't fail the request if email fails
    
    return db_message

@app.get("/api/testimonials", response_model=List[schemas.Testimonial])
def get_testimonials(db: Session = Depends(get_db)):
    return db.query(models.Testimonial).all()

# Protected API
@app.post("/api/projects", response_model=schemas.Project)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_admin)):
    db_project = models.Project(**project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.put("/api/projects/{project_id}", response_model=schemas.Project)
def update_project(project_id: int, project: schemas.ProjectCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_admin)):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    for key, value in project.model_dump().items():
        setattr(db_project, key, value)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.delete("/api/projects/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_admin)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
    return {"ok": True}

@app.post("/api/services", response_model=schemas.Service)
def create_service(service: schemas.ServiceCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_admin)):
    db_service = models.Service(**service.model_dump())
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service

@app.put("/api/services/{service_id}", response_model=schemas.Service)
def update_service(service_id: int, service: schemas.ServiceCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_admin)):
    db_service = db.query(models.Service).filter(models.Service.id == service_id).first()
    if not db_service:
        raise HTTPException(status_code=404, detail="Service not found")
    for key, value in service.model_dump().items():
        setattr(db_service, key, value)
    db.commit()
    db.refresh(db_service)
    return db_service

@app.delete("/api/services/{service_id}")
def delete_service(service_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_admin)):
    service = db.query(models.Service).filter(models.Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    db.delete(service)
    db.commit()
    return {"ok": True}

@app.get("/api/messages", response_model=List[schemas.Message])
def get_messages(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_admin)):
    return db.query(models.Message).order_by(models.Message.timestamp.desc()).all()

@app.post("/api/testimonials", response_model=schemas.Testimonial)
def create_testimonial(testimonial: schemas.TestimonialCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_admin)):
    db_testimonial = models.Testimonial(**testimonial.model_dump())
    db.add(db_testimonial)
    db.commit()
    db.refresh(db_testimonial)
    return db_testimonial

@app.delete("/api/testimonials/{testimonial_id}")
def delete_testimonial(testimonial_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_admin)):
    testimonial = db.query(models.Testimonial).filter(models.Testimonial.id == testimonial_id).first()
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    db.delete(testimonial)
    db.commit()
    return {"ok": True}

@app.put("/api/profile", response_model=schemas.Profile)
def update_profile(profile: schemas.ProfileCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_admin)):
    db_profile = db.query(models.Profile).first()
    if not db_profile:
        db_profile = models.Profile(**profile.model_dump())
        db.add(db_profile)
    else:
        for key, value in profile.model_dump().items():
            setattr(db_profile, key, value)
    db.commit()
    db.refresh(db_profile)
    return db_profile

@app.post("/api/certificates/upload")
async def upload_certificates(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_admin)):
    csvReader = csv.DictReader(codecs.iterdecode(file.file, 'utf-8'))
    count = 0
    for row in csvReader:
        title = row.get("Name")
        issuer = row.get("Issuing Organization")
        url = row.get("Credential URL")
        
        if title and issuer:
            exists = db.query(models.Certificate).filter(models.Certificate.title == title).first()
            if not exists:
                cert = models.Certificate(
                    title=title,
                    issuer=issuer,
                    url=url,
                    date=datetime.datetime.utcnow()
                )
                db.add(cert)
                count += 1
    db.commit()
    return {"msg": f"Uploaded {count} certificates"}

# About Page APIs
@app.get("/api/about-content", response_model=schemas.AboutContent)
def get_about_content(db: Session = Depends(get_db)):
    content = db.query(models.AboutContent).first()
    if not content:
        # Return default content
        return schemas.AboutContent(
            id=0,
            intro1="Hi, I'm Amil Mether. I'm a Computer Engineering student with a passion for building things that live on the internet and in the physical world.",
            intro2="My journey started with simple HTML pages, but quickly evolved into full-stack web applications and embedded systems. I love the intersection of software and hardware—making code interact with the real world."
        )
    return content

@app.put("/api/about-content", response_model=schemas.AboutContent)
def update_about_content(content: schemas.AboutContentCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_admin)):
    db_content = db.query(models.AboutContent).first()
    if not db_content:
        db_content = models.AboutContent(**content.model_dump())
        db.add(db_content)
    else:
        for key, value in content.model_dump().items():
            setattr(db_content, key, value)
    db.commit()
    db.refresh(db_content)
    return db_content

# Experience APIs
@app.get("/api/experiences", response_model=List[schemas.Experience])
def get_experiences(db: Session = Depends(get_db)):
    return db.query(models.Experience).all()

@app.post("/api/experiences", response_model=schemas.Experience)
def create_experience(experience: schemas.ExperienceCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_admin)):
    db_experience = models.Experience(**experience.model_dump())
    db.add(db_experience)
    db.commit()
    db.refresh(db_experience)
    return db_experience

@app.put("/api/experiences/{experience_id}", response_model=schemas.Experience)
def update_experience(experience_id: int, experience: schemas.ExperienceCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_admin)):
    db_experience = db.query(models.Experience).filter(models.Experience.id == experience_id).first()
    if not db_experience:
        raise HTTPException(status_code=404, detail="Experience not found")
    for key, value in experience.model_dump().items():
        setattr(db_experience, key, value)
    db.commit()
    db.refresh(db_experience)
    return db_experience

@app.delete("/api/experiences/{experience_id}")
def delete_experience(experience_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_admin)):
    experience = db.query(models.Experience).filter(models.Experience.id == experience_id).first()
    if not experience:
        raise HTTPException(status_code=404, detail="Experience not found")
    db.delete(experience)
    db.commit()
    return {"ok": True}

# Timeline APIs
@app.get("/api/timeline", response_model=List[schemas.TimelineItem])
def get_timeline(db: Session = Depends(get_db)):
    return db.query(models.TimelineItem).all()

@app.post("/api/timeline", response_model=schemas.TimelineItem)
def create_timeline_item(item: schemas.TimelineItemCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_admin)):
    db_item = models.TimelineItem(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.put("/api/timeline/{item_id}", response_model=schemas.TimelineItem)
def update_timeline_item(item_id: int, item: schemas.TimelineItemCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_admin)):
    db_item = db.query(models.TimelineItem).filter(models.TimelineItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Timeline item not found")
    for key, value in item.model_dump().items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.delete("/api/timeline/{item_id}")
def delete_timeline_item(item_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_admin)):
    item = db.query(models.TimelineItem).filter(models.TimelineItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Timeline item not found")
    db.delete(item)
    db.commit()
    return {"ok": True}

# Skill Categories APIs
@app.get("/api/skill-categories", response_model=List[schemas.SkillCategory])
def get_skill_categories(db: Session = Depends(get_db)):
    return db.query(models.SkillCategory).order_by(models.SkillCategory.display_order).all()

@app.post("/api/skill-categories", response_model=schemas.SkillCategory)
def create_skill_category(category: schemas.SkillCategoryCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_admin)):
    db_category = models.SkillCategory(**category.model_dump())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@app.put("/api/skill-categories/{category_id}", response_model=schemas.SkillCategory)
def update_skill_category(category_id: int, category: schemas.SkillCategoryCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_admin)):
    db_category = db.query(models.SkillCategory).filter(models.SkillCategory.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    for key, value in category.model_dump().items():
        setattr(db_category, key, value)
    db.commit()
    db.refresh(db_category)
    return db_category

@app.delete("/api/skill-categories/{category_id}")
def delete_skill_category(category_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_admin)):
    category = db.query(models.SkillCategory).filter(models.SkillCategory.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    # Delete all skills in this category
    db.query(models.Skill).filter(models.Skill.category == category.name).delete()
    db.delete(category)
    db.commit()
    return {"ok": True}

# Skills APIs
@app.get("/api/skills", response_model=List[schemas.Skill])
def get_skills(db: Session = Depends(get_db)):
    return db.query(models.Skill).all()

@app.post("/api/skills", response_model=schemas.Skill)
def create_skill(skill: schemas.SkillCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_admin)):
    db_skill = models.Skill(**skill.model_dump())
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill

@app.delete("/api/skills/{skill_id}")
def delete_skill(skill_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_admin)):
    skill = db.query(models.Skill).filter(models.Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    db.delete(skill)
    db.commit()
    return {"ok": True}

@app.post("/setup-admin")
def create_initial_admin(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).first():
        raise HTTPException(status_code=400, detail="Admin already exists")
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    return {"msg": "Admin created"}

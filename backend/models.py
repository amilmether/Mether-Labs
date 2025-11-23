from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, Boolean
from .database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class Profile(Base):
    __tablename__ = "profile"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    bio = Column(Text)
    role = Column(String)
    location = Column(String)
    status = Column(String)
    whatsapp = Column(String)  # WhatsApp number

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    slug = Column(String, unique=True, index=True)
    short_description = Column(String)
    detailed_description = Column(Text)
    stack = Column(JSON)
    category = Column(String) # Web, Embedded, etc.
    priority = Column(String) # High, Medium, Low (Legacy, keep for now or repurpose)
    link = Column(String) # Live URL
    github_link = Column(String)
    images = Column(JSON) # List of image URLs
    featured = Column(Boolean, default=False)

class Service(Base):
    __tablename__ = "services"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    short_description = Column(String)
    detailed_description = Column(Text)
    price_from = Column(String)
    deliverables = Column(JSON)
    stack = Column(JSON)
    is_active = Column(Boolean, default=True)

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    type = Column(String)
    budget = Column(String)
    whatsapp = Column(String)
    message = Column(Text)
    read = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class Certificate(Base):
    __tablename__ = "certificates"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    issuer = Column(String)
    date = Column(DateTime)
    url = Column(String)

class Analytics(Base):
    __tablename__ = "analytics"
    id = Column(Integer, primary_key=True, index=True)
    ip_hash = Column(String, index=True)
    path = Column(String)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class Testimonial(Base):
    __tablename__ = "testimonials"
    id = Column(Integer, primary_key=True, index=True)
    client_name = Column(String)
    role = Column(String)
    text = Column(Text)

class AboutContent(Base):
    __tablename__ = "about_content"
    id = Column(Integer, primary_key=True, index=True)
    intro1 = Column(Text)
    intro2 = Column(Text)

class Experience(Base):
    __tablename__ = "experiences"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    company = Column(String)
    start_date = Column(String)  # Format: YYYY-MM
    end_date = Column(String)    # Format: YYYY-MM
    current = Column(Boolean, default=False)
    description = Column(Text)

class TimelineItem(Base):
    __tablename__ = "timeline"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(String)  # Format: YYYY-MM
    title = Column(String)
    description = Column(Text)

class SkillCategory(Base):
    __tablename__ = "skill_categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    display_order = Column(Integer, default=0)

class Skill(Base):
    __tablename__ = "skills"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    category = Column(String)  # References SkillCategory.name

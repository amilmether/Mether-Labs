from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    class Config:
        from_attributes = True

class ProjectBase(BaseModel):
    title: str
    slug: str
    short_description: str
    detailed_description: str
    stack: List[str]
    category: str
    priority: str = "Medium"
    link: Optional[str] = None
    github_link: Optional[str] = None
    images: List[str] = []
    featured: bool = False

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    class Config:
        from_attributes = True

class ServiceBase(BaseModel):
    title: str
    short_description: str
    detailed_description: str
    price_from: str
    deliverables: List[str]
    stack: List[str]
    is_active: bool = True

class ServiceCreate(ServiceBase):
    pass

class Service(ServiceBase):
    id: int
    class Config:
        from_attributes = True

class MessageBase(BaseModel):
    name: str
    email: str
    type: str
    budget: Optional[str] = None
    whatsapp: Optional[str] = None
    message: str

class MessageCreate(MessageBase):
    pass

class Message(MessageBase):
    id: int
    read: bool
    timestamp: datetime
    class Config:
        from_attributes = True

class TestimonialBase(BaseModel):
    client_name: str
    role: str
    text: str

class TestimonialCreate(TestimonialBase):
    pass

class Testimonial(TestimonialBase):
    id: int
    class Config:
        from_attributes = True

class ProfileBase(BaseModel):
    name: str
    bio: str
    role: str
    location: str
    status: str
    whatsapp: Optional[str] = None

class ProfileCreate(ProfileBase):
    pass

class Profile(ProfileBase):
    id: int
    class Config:
        from_attributes = True

class Stats(BaseModel):
    total_views: int
    unique_visitors: int

class AboutContentBase(BaseModel):
    intro1: str
    intro2: str

class AboutContentCreate(AboutContentBase):
    pass

class AboutContent(AboutContentBase):
    id: int
    class Config:
        from_attributes = True

class ExperienceBase(BaseModel):
    title: str
    company: str
    start_date: str
    end_date: Optional[str] = None
    current: bool = False
    description: str

class ExperienceCreate(ExperienceBase):
    pass

class Experience(ExperienceBase):
    id: int
    class Config:
        from_attributes = True

class TimelineItemBase(BaseModel):
    date: str
    title: str
    description: str

class TimelineItemCreate(TimelineItemBase):
    pass

class TimelineItem(TimelineItemBase):
    id: int
    class Config:
        from_attributes = True

class SkillCategoryBase(BaseModel):
    name: str
    display_order: int = 0

class SkillCategoryCreate(SkillCategoryBase):
    pass

class SkillCategory(SkillCategoryBase):
    id: int
    class Config:
        from_attributes = True

class SkillBase(BaseModel):
    name: str
    category: str

class SkillCreate(SkillBase):
    pass

class Skill(SkillBase):
    id: int
    class Config:
        from_attributes = True

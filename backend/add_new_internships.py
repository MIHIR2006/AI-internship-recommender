#!/usr/bin/env python3
"""Script to add new internships to the database and update vectorstore"""

import sys
import os
sys.path.append('.')

from db.database import SessionLocal, engine
from db.models import Internship, Base
from db.schemas import InternshipCreate
from db.vectorstore import build_vectorstore

def add_internships():
    """Add the new internships to the database"""
    
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    # Define the new internships
    internships = [
        InternshipCreate(
            title="Marketing Intern",
            description="Assist in marketing campaigns, content creation, and lead generation.",
            skills_required="Communication, Social Media, Canva",
            location="Mumbai, Maharashtra",
            stipend="₹5,000/month",
            duration="3 months"
        ),
        InternshipCreate(
            title="Finance Intern",
            description="Work with the accounts and finance team on auditing and budgeting tasks.",
            skills_required="Excel, Tally, Accounting Basics",
            location="New Delhi",
            stipend="₹5,000/month",
            duration="6 months"
        ),
        InternshipCreate(
            title="Software Development Intern",
            description="Develop and maintain internal applications and APIs.",
            skills_required="Python, Django, REST API",
            location="Bangalore, Karnataka",
            stipend="₹5,000/month",
            duration="6 months"
        ),
        InternshipCreate(
            title="Electrical Engineering Intern",
            description="Assist in plant operations and electrical safety checks.",
            skills_required="Circuit Design, AutoCAD, PLC Basics",
            location="Vadodara, Gujarat",
            stipend="₹5,000/month",
            duration="4 months"
        ),
        InternshipCreate(
            title="Mechanical Engineering Intern",
            description="Support the manufacturing team in design and assembly tasks.",
            skills_required="SolidWorks, CAD, Problem Solving",
            location="Pune, Maharashtra",
            stipend="₹5,000/month",
            duration="6 months"
        ),
        InternshipCreate(
            title="Data Analyst Intern",
            description="Work on data visualization, report generation, and data cleaning.",
            skills_required="Excel, SQL, Power BI",
            location="Hyderabad, Telangana",
            stipend="₹5,000/month",
            duration="3 months"
        ),
        InternshipCreate(
            title="Customer Support Intern",
            description="Handle customer queries and complaints across multiple channels.",
            skills_required="English Fluency, CRM Tools",
            location="Chennai, Tamil Nadu",
            stipend="₹5,000/month",
            duration="3 months"
        ),
        InternshipCreate(
            title="Content Writing Intern",
            description="Create blogs, product descriptions, and SEO content.",
            skills_required="English Writing, SEO, WordPress",
            location="Remote",
            stipend="₹5,000/month",
            duration="2 months"
        ),
        InternshipCreate(
            title="Business Development Intern",
            description="Identify business leads and perform outreach to potential clients.",
            skills_required="Sales, CRM, Communication",
            location="Ahmedabad, Gujarat",
            stipend="₹5,000/month",
            duration="3 months"
        ),
        InternshipCreate(
            title="HR Intern",
            description="Support HR operations including recruitment and employee engagement.",
            skills_required="MS Office, Communication, HRMS Tools",
            location="Kolkata, West Bengal",
            stipend="₹5,000/month",
            duration="4 months"
        ),
        InternshipCreate(
            title="Graphic Design Intern",
            description="Design marketing materials, social media posts, and presentations.",
            skills_required="Photoshop, Illustrator, Figma",
            location="Noida, Uttar Pradesh",
            stipend="₹5,000/month",
            duration="3 months"
        ),
        InternshipCreate(
            title="Supply Chain Intern",
            description="Assist in procurement, inventory, and logistics management.",
            skills_required="Excel, ERP, Logistics Knowledge",
            location="Chandigarh",
            stipend="₹5,000/month",
            duration="4 months"
        ),
        InternshipCreate(
            title="Legal Intern",
            description="Assist in reviewing contracts, drafting legal documents, and compliance tasks.",
            skills_required="Legal Drafting, MS Word, Indian Laws",
            location="Delhi NCR",
            stipend="₹5,000/month",
            duration="3 months"
        ),
        InternshipCreate(
            title="UI/UX Intern",
            description="Design intuitive user interfaces and enhance UX for web and mobile apps.",
            skills_required="Figma, UX Research, HTML/CSS",
            location="Remote",
            stipend="₹5,000/month",
            duration="2 months"
        ),
        InternshipCreate(
            title="Environmental Intern",
            description="Work on sustainability initiatives and environmental data collection.",
            skills_required="Environmental Science, Research, MS Excel",
            location="Bhopal, Madhya Pradesh",
            stipend="₹5,000/month",
            duration="4 months"
        )
    ]
    
    db = SessionLocal()
    try:
        # Check existing internships to avoid duplicates
        existing_titles = {internship.title for internship in db.query(Internship).all()}
        
        added_count = 0
        for internship_data in internships:
            if internship_data.title not in existing_titles:
                # Create new internship record
                internship = Internship(
                    title=internship_data.title,
                    description=internship_data.description,
                    skills_required=internship_data.skills_required,
                    location=internship_data.location,
                    stipend=internship_data.stipend,
                    duration=internship_data.duration
                )
                db.add(internship)
                added_count += 1
                print(f"✅ Added: {internship_data.title}")
            else:
                print(f"⏭️  Skipped (already exists): {internship_data.title}")
        
        db.commit()
        print(f"\n🎉 Successfully added {added_count} new internships!")
        
        # Get total count
        total_internships = db.query(Internship).count()
        print(f"📊 Total internships in database: {total_internships}")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error adding internships: {e}")
        raise
    finally:
        db.close()
    
    return added_count

def update_vectorstore():
    """Update the vectorstore with all internships"""
    print("\n🔄 Updating vectorstore with all internships...")
    try:
        build_vectorstore()
        print("✅ Vectorstore updated successfully!")
    except Exception as e:
        print(f"❌ Error updating vectorstore: {e}")
        raise

def main():
    """Main function to add internships and update vectorstore"""
    print("🚀 Adding new internships to the database...")
    
    try:
        # Add internships to database
        added_count = add_internships()
        
        if added_count > 0:
            # Update vectorstore with new internships
            update_vectorstore()
            
            print(f"\n🎉 All done! Added {added_count} new internships and updated the vectorstore.")
            print("💡 The new internships are now available for recommendations!")
        else:
            print("\n📝 No new internships were added (all already exist).")
            print("🔄 Updating vectorstore anyway to ensure it's current...")
            update_vectorstore()
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())

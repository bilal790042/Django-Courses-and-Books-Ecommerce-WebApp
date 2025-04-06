import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from .models import Course

def get_similar_courses(course_id, num_recommendations=4):
    courses = Course.objects.all()
    course_list = list(courses.values('id', 'title', 'category', 'tags', 'description'))
    
    # Convert data into a pandas DataFrame
    df = pd.DataFrame(course_list)
    
    # Combine 'category', 'tags', and 'description' as course content
    df['content'] = df['category'] + " " + df['tags'] + " " + df['description']
    
    # TF-IDF Vectorization
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(df['content'])
    
    # Compute cosine similarity between courses
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

    # Get index of the target course
    course_index = df[df['id'] == course_id].index[0]
    
    # Get similarity scores for the target course
    sim_scores = list(enumerate(cosine_sim[course_index]))
    
    # Sort courses by similarity score
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    
    # Get the most similar courses (excluding itself)
    sim_scores = sim_scores[1:num_recommendations + 1]
    
    # Fetch course IDs
    similar_course_ids = [df.iloc[i[0]]['id'] for i in sim_scores]
    
    # Retrieve courses from the database
    similar_courses = Course.objects.filter(id__in=similar_course_ids)

    return similar_courses

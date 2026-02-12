import os
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from threading import Thread
from email.mime.text import MIMEText
import smtplib
from datetime import datetime
from langchain_openai import AzureChatOpenAI
from langchain_core.messages import HumanMessage
from datetime import datetime, timedelta
from typing import List, Optional,NotRequired
from typing import TypedDict, Annotated
import os
from dotenv import load_dotenv
load_dotenv()
from mail import send_email,schedule_email_once


app = Flask(__name__)
CORS(app, origins=["http://localhost:4200", "http://127.0.0.1:4200"], supports_credentials=True)  # Allow Angular dev server
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

class ResponseFormat(TypedDict):
    summary: List[str]

def get_llm():
    api_key = os.getenv("API_KEY")
    azure_endpoint = os.getenv("ENDPOINT")
    llm_model=os.getenv("LLM_MODEL")
    version=os.getenv("VERSION")

    llm = AzureChatOpenAI(
        openai_api_version=version,
        azure_deployment=llm_model,
        temperature=0,
        max_tokens=4096,
        api_key = api_key, 
        azure_endpoint = azure_endpoint     
    )
    return llm



# Dummy summarization (replace with LLM call)
def summarize_transcript(transcript: str) -> str:
    return f"""
    Summarize the following transcript into concise bullet points.
    - Use short, direct sentences.
    - Keep the summary clean and easy to read.
    - Limit each bullet to one key idea.
    - Do not include filler words or repetition.
    - Format the output explicitly as a list of bullet points (using '-' or '*').

    Transcript:
    {transcript}
    """



# Email sending function

@app.route('/submit_transcript', methods=['POST'])
def submit_transcript():
    # Accepts JSON: {"transcript": ..., "email": ..., "schedule_time": ...}
    data = request.get_json()
    transcript = data.get('transcript')
    email = data.get('email')
    scheduledTime=data.get('scheduledTime')
    print(email)
   
    if not transcript:
        return jsonify({'error': 'Transcript is required'}), 400
    if not email:
        return jsonify({'error': 'Email is required'}), 400
        
    summary = summarize_transcript(transcript)
    messages=[HumanMessage(content=summary)]
    llm=get_llm()
    result=llm.with_structured_output(ResponseFormat).invoke(messages)
    res_summary="\n".join(point for point in result['summary'])
    subject = "Your Conversation Summary"
    body = f"Hello,\n\nSummary:\n{res_summary}\n\nTranscript:\n{transcript} \n\nBest Regards,\nSai Nitish"
    print(f"Scheduling email to {email} with subject '{subject}' and body:\n{body}")
    if(not scheduledTime):
        send_email(email, subject, body)
    else:
        schedule_email_once(email, subject, body,scheduledTime)
   
    return jsonify({'success': True,'summary':res_summary}), 200



if __name__ == '__main__':
    app.run(debug=True,host='localhost',port=5000)








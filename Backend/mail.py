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
import threading
import os
from dotenv import load_dotenv
load_dotenv()


def send_email(recipient, subject, body):
    smtp_server = os.getenv('SMTP_SERVER')
    smtp_port = int(os.getenv('SMTP_PORT'))
    smtp_user = os.getenv('SMTP_USER')
    smtp_password = os.getenv('SMTP_PASSWORD')
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = smtp_user
    msg['To'] = recipient
    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.sendmail(smtp_user, [recipient], msg.as_string())

def schedule_email_once(recipient, subject, body, send_time_str):
   
    now = datetime.now()
    send_time = datetime.strptime(send_time_str, "%H:%M").time()

    
    scheduled_datetime = datetime.combine(now.date(), send_time)

   
    if scheduled_datetime <= now:
        scheduled_datetime += timedelta(days=1)

    delay_seconds = (scheduled_datetime - now).total_seconds()

    print(f"Scheduling email to {recipient} at {scheduled_datetime.strftime('%Y-%m-%d %H:%M')}")

   
    timer = threading.Timer(delay_seconds, send_email, args=[recipient, subject, body])
    timer.start()



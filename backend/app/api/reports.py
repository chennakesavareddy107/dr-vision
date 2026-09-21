from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
import os
import time

try:
    import pdfkit
    PDFKIT_AVAILABLE = True
except ImportError:
    pdfkit = None
    PDFKIT_AVAILABLE = False

router = APIRouter()

@router.post("/reports/generate")
async def generate_report(data: dict):
    try:
        # Mocking PDF generation for now, this would use data + jinja2 template
        # to generate a report via pdfkit.
        patient_name = data.get("patientName", "Unknown")
        prediction = data.get("prediction", "Unknown")
        confidence = data.get("confidence", 0.0)
        
        html_content = f"""
        <html>
        <head><title>DR Vision Medical Report</title></head>
        <body>
            <h1>Medical Inference Report</h1>
            <p><strong>Patient:</strong> {patient_name}</p>
            <p><strong>Date:</strong> {time.strftime('%Y-%m-%d')}</p>
            <hr/>
            <h2>Diagnosis</h2>
            <p><strong>Prediction:</strong> Grade {prediction}</p>
            <p><strong>Confidence:</strong> {confidence * 100:.2f}%</p>
            <h3>Clinical Recommendation</h3>
            <p>Follow up with attending specialist based on Grade {prediction} classification.</p>
        </body>
        </html>
        """
        
        # Save temp PDF
        pdf_path = f"/tmp/report_{int(time.time())}.pdf"
        # On windows, /tmp doesn't exist, handle dynamically
        import tempfile
        temp_dir = tempfile.gettempdir()
        pdf_path = os.path.join(temp_dir, f"report_{int(time.time())}.pdf")
        
        # NOTE: requires wkhtmltopdf installed on system
        if PDFKIT_AVAILABLE:
            try:
                pdfkit.from_string(html_content, pdf_path)
                return FileResponse(pdf_path, media_type="application/pdf", filename="clinical_report.pdf")
            except Exception as e:
                # Fallback if wkhtmltopdf isn't installed locally
                print(f"Warning: PDF generation failed ({e}), returning mock path")
                return {"message": "PDF Generation requires wkhtmltopdf. Returning mock success.", "mock_url": "/mock_report.pdf"}
        else:
            return {"message": "PDF Generation requires wkhtmltopdf and pdfkit. Returning mock success.", "mock_url": "/mock_report.pdf"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

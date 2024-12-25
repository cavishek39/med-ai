# Med_AI - Medical Report Summarizer

**Med_AI** is a cutting-edge application designed to analyze medical reports and provide concise, accurate summaries. Built as a **Retrieval-Augmented Generation (RAG)** model, the app integrates advanced AI technology and a robust tech stack to deliver highly relevant and meaningful insights for healthcare professionals.

## Test the app:
  https://med-ai-git-main-cavishek39s-projects.vercel.app/

---

## 🚀 **Features**
- **Medical Report Summarization**: Automatically generates a summary of medical reports, highlighting key findings and recommendations.
- **Accurate Retrieval**: Powered by Gemini AI and Pinecone DB for precise data retrieval and context generation.
- **User-Friendly Interface**: Built using Radix UI for an accessible and intuitive user experience.
- **High Performance**: Developed with Next.js, ensuring speed, scalability, and seamless interactivity.

---

## 🛠 **Tech Stack**
- **Next.js**: For server-side rendering, routing, and user interface building.
- **Gemini AI**: Provides powerful natural language understanding and generation capabilities.
- **Pinecone DB**: Used as the vector database for efficient and scalable document retrieval.
- **Radix UI**: Ensures a responsive, accessible, and aesthetically pleasing user interface.

---

## 📂 **Architecture**
1. **Report Analysis**:
   - Upload or input a medical report into the app.
   - The report is parsed and processed for key medical terminologies and context.

2. **Retrieval-Augmented Generation (RAG)**:
   - Relevant contextual data is retrieved from Pinecone DB.
   - Gemini AI generates a concise, human-readable summary using the retrieved information.

3. **User Interface**:
   - The output is displayed in a clean and interactive UI designed with Radix UI.

4. **Next.js Integration**:
   - Enables seamless data fetching, API integration, and dynamic rendering.

---

## 💡 **How It Works**
1. **Upload Medical Report**: Users can drag-and-drop or upload their medical reports in supported formats (e.g., PDF, DOCX).
2. **AI Processing**: The app leverages RAG architecture to analyze the document:
   - Relevant information is fetched using Pinecone DB.
   - Gemini AI synthesizes the data into a summary.
3. **Output Summary**: A concise and accurate summary is presented on the user interface.

---

## 🖥 **Setup & Deployment**
### **Prerequisites**
- Node.js (v16 or higher)
- Pinecone DB API key
- Gemini AI API key

### **Local Setup**
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/med_ai.git
   cd med_ai
   ```
2.	Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Add PINECONE_API_KEY and GEMINI_API_KEY to your .env.local file.
4. Run the development server:
   ```bash
   npm run dev
   ```
5.	Access the app at http://localhost:3000.

## 🌟 Why Med_AI?
	•	Time-Saving: Reduces the manual effort required to analyze lengthy medical reports.
	•	Precision: Ensures critical medical details are not overlooked.
	•	Accessibility: Empowers healthcare professionals to make faster, informed decisions.
## Future Enhancements
	•	Support for multilingual medical reports.
	•	Integration with Electronic Health Record (EHR) systems.
	•	Advanced visualization tools for detailed summaries.

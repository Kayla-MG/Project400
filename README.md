# Project400
## MyToolbox
MyToolbox is a specialized assistive mobile application designed to facilitate emotional regulation and routine management for neurodivergent individuals, specifically teens and adolescents.

Developed with a focus on accessibility and low cognitive load, the application integrates proactive mood tracking with reactive de-escalation strategies to support daily functioning and mitigate crisis situations. The interface prioritizes visual-first navigation to reduce verbal demand and cognitive overhead for the user.

Tech Stack - 
Frontend: React Native & Expo

Backend: Node.js & Express (Hosted on Render)

Database: MySQL (Hosted on Railway)

Key Features - 
Proactive Mood Tracking: Allows users to log emotional states with a focus on ease of use.

Crisis Intervention: Detects high-distress patterns (e.g., 3 consecutive days of crisis) and prompts the user to contact a saved support person.

Reactive De-escalation: A dedicated "Calm Now" toolkit containing various grounding exercises and tools.

Customization: Users can personalize the app by changing background visuals, tool colors, and managing which tools appear in their toolkit.

Privacy by Design: Personal contacts and identifiers are stored locally on the device (AsyncStorage), while anonymized logs are synced to the cloud.

User Validation - 
The application was demonstrated to neurodivergent students at ATU Sligo. Their feedback directly led to the implementation of the customization features and the automated support contact prompt.

Installation - 
Clone the repository.

Run npm install to install dependencies.

Use npx expo start to launch the application.

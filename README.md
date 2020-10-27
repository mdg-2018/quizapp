### MongoDB Certification Study App

Getting Started

1. Restore mongodump with practice exam questions (questions are stored in the <code>data</code> directory). These questions might be a bit out of date since I took the exam a while back, but they should still be helpful.<br>
<code>cd data</code><br>
<code>tar -xvf data.tar</code><br>
<code>cd data</code><br>
<code>mongorestore [options]</code>

2. Install dependencies - <code>npm install</code>
3. Set your mongodb connection string in <code>config.js</code>
4. Run <code>node quiz.js quiz</code>
5. Navigate to <code>http://localhost:8081</code> and start answering questions!

Notes
- The app is set up to prioritize questions you have attempted least often
- There's a bunch of extra code for loading the quiz questions into the database, but this can be ignored if you're just using the questions already available from the included mongodump.
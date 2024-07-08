//
// For guidance on how to add JavaScript see:
// https://prototype-kit.service.gov.uk/docs/adding-css-javascript-and-images
//

window.GOVUKPrototypeKit.documentReady(() => {
  // Add JavaScript here
})

const express = require('express');
const app = express();

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

app.post('/subject-areas', function (req, res) {
  const selectedSubjects = req.body.subjects;
  // ... (your existing route handler logic)
  if (selectedSubjects && selectedSubjects.includes('I do not teach any of these subjects')) {
    // Redirect to a specific page if this option is selected
    res.redirect('/you-are-not-eligible-subjects');
  } else {
    // Redirect to a different page based on the selected subjects
    if (subjectAreas && subjectAreas.includes('Building and construction')) {
      res.redirect('/building-course');
    } else if (subjectAreas && subjectAreas.includes('Chemistry')) {
      res.redirect('/chemistry-course');
    } else if (subjectAreas && subjectAreas.includes('Computing, including digital and ICT')) {
      res.redirect('/computing-course');
    } else if (subjectAreas && subjectAreas.includes('Early years')) {
      res.redirect('/early-years-course');
    } else if (subjectAreas && subjectAreas.includes('Engineering and manufacturing, including transport engineering and electronics')) {
      res.redirect('/engineering-course');
    } else if (subjectAreas && subjectAreas.includes('Maths')) {
      res.redirect('/maths-course');
    } else if (subjectAreas && subjectAreas.includes('Physics')) {
      res.redirect('/physics-course');
    } else if (subjectAreas && subjectAreas.includes('I do not teach any of these subjects')) {
      res.redirect('/you-are-not-eligible-subjects');
    }
    // Add more conditions for other subject areas as needed
    else {
      // If none of the conditions match, redirect to a default page
      res.redirect('/subject-areas');
    }
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

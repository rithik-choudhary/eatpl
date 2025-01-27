const express = require('express');
const router = express.Router();
const { getQuestions } = require('../utils/dataHelpers');


// Route for sub-exams (e.g., IPS, IRS under UPSC)
router.get('/:exam', async (req, res) => {
    try {
        const data = await getQuestions();
        const exam = req.params.exam.toLowerCase();
        const examData = data.exams.find(e => e.examId === exam);

        if (!examData) {
            return res.status(404).send('Exam not found');
        }

        if (examData.subExams) {
            res.render('subexams', { 
                exam: examData.examId,
                examName: examData.examName,
                subExams: examData.subExams
            });
            
        } else {
            const subjects = examData.subjects.map(s => ({
                id: s.subjectId,
                name: s.subjectName
            }));
            res.render('subjects', { 
                exam, 
                examName: examData.examName,
                subjects,
                isSubExamView: false
            });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error loading exam data');
    }
});

// Route for subjects under sub-exams
router.get('/:exam/:subExam/subjects', async (req, res) => {
    try {
        const data = await getQuestions();
        const { exam, subExam } = req.params;
        
        const examData = data.exams.find(e => e.examId === exam);
        if (!examData) {
            return res.status(404).send('Exam not found');
        }

        const subExamData = examData.subExams?.find(se => se.subExamId === subExam);
        if (!subExamData) {
            return res.status(404).send('Sub-exam not found');
        }

        const subjects = subExamData.subjects.map(s => ({
            id: s.subjectId,
            name: s.subjectName
        }));

        res.render('subjects', { 
            exam,
            subExam,
            examName: `${examData.examName} - ${subExamData.subExamName}`,
            subjects,
            isSubExamView: true
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error loading.... subjects');
    }
});
// router.get('/upsc', (req, res) => {
//     res.send('UPSC exams');
//   });
  
//   router.get('/cgl', (req, res) => {
//     res.send('CGL exams');
//   });
  
module.exports = router;
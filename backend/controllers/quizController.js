const Question = require("../models/Question");
const User = require("../models/User");

const k = 0.2;
const e = 2.71828;

exports.startQuiz = async (req, res) => {
  const questions = await Question.aggregate([{ $sample: { size: 10 } }]);
  req.session = req.session || {};
  req.session.quizStart = Date.now();
  req.session.currentIndex = 0;
  req.session.correctAnswers = questions.map(q => q.correct_answer);
  req.session.questions = questions.map(({ _id, question, incorrect_answers }) => ({
    _id, question, options: shuffle([...incorrect_answers])
  }));

  res.json(req.session.questions.map(q => ({
    _id: q._id,
    question: q.question,
    options: q.options
  })));
};

exports.answerQuestion = async (req, res) => {
  const { index, answer } = req.body;
  const correct = req.session.correctAnswers[index];
  const startTime = req.session.quizStart;
  const timeTaken = (Date.now() - startTime) / 1000;

  const grade = answer === correct ? 1 : 0;
  const score = Math.round(100 * grade * Math.pow(e, -k * timeTaken));

  if (index === 9) {
    await User.findByIdAndUpdate(req.user.id, {
      $push: { history: { score: score } }
    });
  }

  res.json({ score, grade, time: timeTaken });
};

exports.getLeaderboard = async (req, res) => {
  const users = await User.find();
  const allScores = users.map(u => ({
    username: u.username,
    bestScore: Math.max(...u.history.map(h => h.score), 0)
  }));

  allScores.sort((a, b) => b.bestScore - a.bestScore);
  res.json(allScores.slice(0, 10));
};

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

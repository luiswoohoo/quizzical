import React from 'react'
import './App.css'

import { nanoid } from 'nanoid'
import he from 'he'
import Confetti from 'react-confetti'

import Answer from './components/Answer'

export default function App() {
    const [quizStarted, setQuizStarted] = React.useState(false)
    const [quizGameData, setQuizGameData] = React.useState([])
    const [quizScore, setQuizScore] = React.useState(-1)
    const [getNewQuizData, setGetNewQuizData] = React.useState(false)

    // Calculate height of window. This is done so that the
    // Confetti component renders confetti across the entire height of the screen
    let scrollHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
    )

    // Get quiz data from API
    React.useEffect(() => {
        // Categories from API
        const categories = [9, 17, 22, 23, 25, 27]
        randomizeArray(categories)

        async function getQuizData() {
            const res = await fetch(
                `https://opentdb.com/api.php?amount=5&category=${categories[0]}&type=multiple`
            )
            const data = await res.json()

            setQuizGameData(generateQuizGameData(data.results))
        }
        getQuizData()
    }, [getNewQuizData])

    function startQuiz() {
        setQuizStarted(true)
    }

    function startNewQuiz() {
        setGetNewQuizData((prevState) => !prevState)
        setQuizScore(() => -1)
    }

    function generateQuizGameData(gameDataFromAPI) {
        let quizData = []

        for (const { question, correct_answer, incorrect_answers } of [...gameDataFromAPI]) {
            let all_answers = generateAnswerObjArray(correct_answer, incorrect_answers)
            randomizeArray(all_answers)

            quizData.push({
                id: nanoid(),
                question: he.decode(question),
                all_answers: all_answers,
            })
        }
        return quizData
    }

    function generateAnswerObjArray(correctAns, incorrectAns) {
        let ansArray = []

        ansArray.push({
            id: nanoid(),
            text: he.decode(correctAns),
            isCorrectAns: true,
            isSelected: false,
            hasBeenChecked: false,
            styleAfterCheck: {},
        })

        for (const ans of incorrectAns) {
            ansArray.push({
                id: nanoid(),
                text: he.decode(ans),
                isCorrectAns: false,
                isSelected: false,
                hasBeenChecked: false,
                styleAfterCheck: {},
            })
        }
        return ansArray
    }

    function randomizeArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[array[i], array[j]] = [array[j], array[i]]
        }
    }

    function selectAnswer(selectedQuestionId, selectedAnswerId) {
        setQuizGameData((prevQuizGame) =>
            prevQuizGame.map((qNA) => {
                if (selectedQuestionId === qNA.id) {
                    return {
                        ...qNA,
                        all_answers: qNA.all_answers.map((ans) => {
                            return ans.id === selectedAnswerId
                                ? { ...ans, isSelected: true }
                                : { ...ans, isSelected: false }
                        }),
                    }
                } else {
                    return qNA
                }
            })
        )
    }

    function checkAnswers() {
        setQuizGameData((prevQuizGame) =>
            prevQuizGame.map((qNA) => {
                return {
                    ...qNA,
                    all_answers: qNA.all_answers.map((ans) => {
                        if (ans.isCorrectAns) {
                            return {
                                ...ans,
                                hasBeenChecked: true,
                                styleAfterCheck: {
                                    backgroundColor: 'hsl(133deg 46% 71%)',
                                    color: 'hsl(231deg 42% 28%)',
                                    fontWeight: 'bold',
                                    border: 'none'
                                },
                            }
                        } else if (!ans.isCorrectAns && ans.isSelected) {
                            return {
                                ...ans,
                                hasBeenChecked: true,
                                styleAfterCheck: {
                                    backgroundColor: 'hsl(0deg 81% 85%)',
                                    color: 'hsl(236deg 17% 63%)',
                                    border: 'none'
                                },
                            }
                        } else {
                            return {
                                ...ans,
                                hasBeenChecked: true,
                                styleAfterCheck: {
                                    backgroundColor: 'hsl(0deg 0%, 100%)',
                                    color: 'hsl(236deg 17% 63%)',
                                    border: 'none'
                                },
                            }
                        }
                    }),
                }
            })
        )
        getScore(quizGameData)
    }

    function getScore(quizGameDataArray) {
        const newQuizGameDataArray = [...quizGameDataArray]
        let correctAnswers = 0
        for (const qNA of newQuizGameDataArray) {
            for (const ans of qNA.all_answers) {
                if (ans.isCorrectAns && ans.isSelected) {
                    correctAnswers++
                }
            }
        }
        setQuizScore(correctAnswers)
    }

    const questionElements = quizGameData.map((qNA) => (
        <div className="qna-section">
            <h2 className="question">{qNA.question}</h2>
            <div className="ans-section">
                {qNA.all_answers.map((ans) => (
                    <Answer
                        key={ans.id}
                        questionId={qNA.id}
                        answerId={ans.id}
                        text={ans.text}
                        isCorrectAnswer={ans.isCorrectAns}
                        isSelected={ans.isSelected}
                        hasBeenChecked={ans.hasBeenChecked}
                        styleAfterCheck={ans.styleAfterCheck}
                        selectAnswer={() => selectAnswer(qNA.id, ans.id)}
                    />
                ))}
            </div>
            <hr />
        </div>
    ))

    return (
        <div>
            {!quizStarted && (
                <div className="start-page">
                    <h1 className='title'>Quizzical</h1>
                    <button className="pushable" onClick={startQuiz}>
                        <span class="shadow"></span>
                        <span class="edge"></span>
                        <span class="front">
                            Start quiz
                        </span>
                    </button>
                </div>
            )}
            {quizStarted && (
                <div className="quiz-page">
                    <div>{questionElements}</div>
                    {quizScore === 5 && <Confetti height={scrollHeight} />}
                    <div className="score-section">
                        {quizScore > -1 && (
                            <h2>
                                You scored {quizScore} out of {quizGameData.length} correct answers {quizScore === 5 ? '🥳' : ''}
                            </h2>
                        )}
                        {quizScore === -1 ? (
                            <button className="quiz-btn" onClick={checkAnswers}>
                                Check answers
                            </button>
                        ) : (
                            <button className="quiz-btn" onClick={startNewQuiz}>
                                Play again
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

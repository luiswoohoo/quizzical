import React from 'react'
import Answer from './Answer'
import { nanoid } from 'nanoid'
import he from 'he'

export default function Quiz(props) {
    // API data comes in as props
    // Process data and pass to Question component

    let quizData= []
    for (const {question, correct_answer, incorrect_answers} of [...props.quizData]) {

        let all_answers = [...incorrect_answers, correct_answer]

        // Randomize all_answers array
        for (let i = all_answers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [all_answers[i], all_answers[j]] = [all_answers[j], all_answers[i]];
        }

        quizData.push({
            question:he.decode(question),
            correct_answer:correct_answer,
            incorrect_answers:incorrect_answers,
            all_answers:all_answers,
            id:nanoid()
        })
    }

    const questionElements = quizData.map( qNA => (
        // {const qKey = nanoid()}
        <div>
            <h2>{qNA.question}</h2>
            
            {qNA.all_answers.map( ans => {
                <Answer 
                    isCorrectAnswer={ans === qNA.correct_answer} 
                    isSelected={false}
                    text={ans}
                    />
                })}
        </div>
 
    ))

    // selectAnswer={}
    // {qNA.all_answers.map( ans => <button>{ans}</button>)}


    return (
        <div>
            <div>I am Quiz</div>
            <div>{questionElements}</div>
        </div>
    )
}
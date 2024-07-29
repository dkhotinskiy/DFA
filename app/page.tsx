'use client'

import { useEffect, useState } from 'react'
import { Fira_Code } from 'next/font/google'
import { DFA } from './DFA'

const firaCode = Fira_Code({ subsets: ['latin'] })
const dfa = new DFA()

export default function Home() {
	const [formalDesc, setFormalDesc] = useState('')
	const [DFAString, setDFAString] = useState('')
	const [res, setRes] = useState('')

	useEffect(() => {
		endsWithOneDFA()
	}, [])

	const endsWithOneDFA = () => {
		dfa.StateQuantity = 2
		dfa.Alphabet = ['0', '1']
		dfa.StateMatrix = [[0, 1], [0, 1]]
		dfa.StartState = 0
		dfa.PassStates = [1]

		setFormalDesc(dfa.getFormalDesc())
		updateRes(DFAString)
	}
	
	const containsSubstringDFA = () => {
		dfa.StateQuantity = 5
		dfa.Alphabet = ['0', '1']
		dfa.StateMatrix = [[1, 0], [2, 0], [2, 3], [1, 4], [4, 4]]
		dfa.StartState = 0
		dfa.PassStates = [0, 1, 2, 3]

		setFormalDesc(dfa.getFormalDesc())
		updateRes(DFAString)
	}

	const updateDFAString = (value: string): void => {
		setDFAString(value)
		updateRes(value)
	}

	const updateRes = (str: string): void => {
		try {
			console.log(str)
			const isPassing = dfa.checkString(str)
			if (isPassing) {
				setRes('Passing')
			} else setRes('Not passing')
		} catch (error: TypeError | RangeError | unknown) {
			if (error instanceof TypeError || error instanceof RangeError) {
				setRes(error.message)
			} else {
				setRes('Error')
			}
		}
	}

	return (
		<main>
			<h1>DFA Checker</h1>

			<section data-predefined>
				<h2>Predefined DFAs</h2>
				<button onClick={endsWithOneDFA}>Ends with 1</button>
				<button onClick={containsSubstringDFA}>Contains the substring "1001"</button>
			</section>

			<pre data-formal-desc className={firaCode.className}>{formalDesc}</pre>

			<p>
				Check string against DFA:&nbsp;
				<input
					type='text'
					value={ DFAString }
					onChange={(props) => updateDFAString(props.target.value)}
				/>
			</p>

			<p>{res}</p>
		</main>
	)
}
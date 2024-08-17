'use client'

import { useEffect, useState } from 'react'
import { Fira_Code } from 'next/font/google'
import { DFA } from './DFA'

const firaCode = Fira_Code({ subsets: ['latin'] })
const dfa = new DFA()

export default function Home() {
	const [formalDesc, setFormalDesc] = useState('')
	const [DFAString, setDFAString] = useState('')
	const [res, setRes] = useState<0 | 1 | 2>(0)

	const [alphabet, setAlphabet] = useState<Array<string>>([])
	const [stateCount, setStateCount] = useState<number>(0)
	const [stateMatrix, setStateMatrix] = useState<Array<Array<number | null>>>([])
	const [currentStep, setCurrentStep] = useState<number>(1)
	const [startState, setStartState] = useState<number | null>(null)
	const [acceptStates, setAcceptStates] = useState<Array<number>>([])

	const nextStep = (): void => {
		switch (currentStep) {
			case 1:
				const alphabetEl = document.querySelector('#alphabet')
				if (alphabetEl instanceof HTMLInputElement) {
					const alphabetStr: string = alphabetEl.value.replaceAll(' ', '')
					const alphabetArray: Array<string> = alphabetStr.split(',')

					if (alphabetArray.length == 0) return

					setAlphabet(alphabetArray)
					alphabetEl.value = alphabetArray.join(', ')
				}
				break
			case 2:
				const stateCountEl = document.querySelector('#state-count')
				if (stateCountEl instanceof HTMLInputElement) {
					const stateCountValue: number = parseInt(stateCountEl.value)

					if (stateCountValue <= 0) return

					setStateCount(stateCountValue)
					stateCountEl.value = stateCountValue.toString()

					const stateArray = Array(alphabet.length).fill(null)
					setStateMatrix(Array(stateCountValue).fill(null).map(() => [...stateArray]))
				}
				break
			case 3:
				let hasEmptyValue = false
				for (const stateRow of stateMatrix) {
					for (const stateValue of stateRow) {
						if (stateValue == null) {
							hasEmptyValue = true
						}
					}
				}

				if (hasEmptyValue) return

				break
			case 5:
				dfa.StateQuantity = stateCount
				dfa.Alphabet = alphabet
				dfa.StateMatrix = stateMatrix as Array<Array<number>>
				dfa.StartState = startState as number
				dfa.PassStates = acceptStates
				setFormalDesc(dfa.getFormalDesc())
				updateRes('')
				break
		}
		setCurrentStep(currentStep + 1)
	}

	const updateDFAString = (value: string): void => {
		setDFAString(value)
		updateRes(value)
	}

	const updateRes = (str: string): void => {
		try {
			const isPassing = dfa.checkString(str)
			if (isPassing) {
				setRes(1)
			} else setRes(0)
		} catch (error: TypeError | RangeError | unknown) {
			if (error instanceof TypeError || error instanceof RangeError) {
				setRes(2)
			} else {
				setRes(2)
			}
		}
	}

	const openDropdown = (targetEl: HTMLElement): void => {
		const optionsWrapper = targetEl.querySelector('[data-options]')

		if (optionsWrapper instanceof HTMLElement) {
			optionsWrapper.dataset.sel = ''
			document.onmousedown = () => {
				delete optionsWrapper.dataset.sel
				document.onmousedown = null
			}
		}
	}

	const selectOption = (stateIndex: number, alphabetIndex: number, value: number): void => {
		const states = [...stateMatrix]
		states[stateIndex][alphabetIndex] = value
		setStateMatrix(states)
	}

	const selectStartState = (state: number) => {
		setStartState(state)
		nextStep()
	}

	const selectAcceptState = (state: number) => {
		const states = [...acceptStates]
		const stateIndex = states.indexOf(state)

		if (stateIndex == -1) {
			states.push(state)
		} else states.splice(stateIndex, 1)

		setAcceptStates(states)
	}

	return (
		<>
			<main>
				<h1>DFA Checker</h1>

				<section data-alphabet>
					<div data-input>
						<label htmlFor='alphabet'>Enter the alphabet for DFA (use "," as seperators):</label>
						<input type='text' id='alphabet' disabled={ currentStep > 1 } />
						{ currentStep == 1 ? <button data-submit onClick={nextStep}>&#8594;</button> : <></> }
					</div>
				</section>

				{
					currentStep < 2 ? <></> :
						<section data-state-count>
							<div data-input>
								<label htmlFor='state-count'>Enter the number of states for DFA:</label>
								<input type='number' id='state-count' disabled={ currentStep > 2 } />
								{ currentStep == 2 ? <button data-submit onClick={nextStep}>&#8594;</button> : <></> }
							</div>
						</section>
				}

				{
					currentStep < 3 ? <></> :
						<section data-state-matrix>
							<div data-input>
								<label htmlFor='state-matrix'>Fill out the state matrix for DFA:</label>

								<table data-state-matrix data-disabled={ currentStep > 3 }>
									<tbody>
										<tr>
											<th>&delta;</th>
											{
												alphabet.map((value: string) => {
													return (<th key={`alphabetHeader${value}`}>{value}</th>)
												})
											}
										</tr>

										{
											Array.from({ length: stateCount }, (_: unknown, stateIndex: number) => {
												return (
													<tr key={`stateRow${stateIndex}`}>
														<td>q<sub>{stateIndex}</sub></td>
														{
															alphabet.map((_: unknown, alphabetIndex) => {
																return (
																	<td key={`stateValue${stateIndex}-${alphabetIndex}`}>
																		<div data-dropdown onClick={e => openDropdown(e.currentTarget)}>
																			<div data-drop-value>
																				<span>
																					{
																						stateMatrix[stateIndex][alphabetIndex] != null ?
																							<>q<sub>{stateMatrix[stateIndex][alphabetIndex]}</sub></> : ''
																					}
																				</span>
																			</div>

																			<span data-options>
																				{
																					Array.from({ length: stateCount }, (_: unknown, value: number) => {
																						return (
																							<div
																								data-drop-option
																								key={`dropOption${stateIndex}-${alphabetIndex}-${value}`}
																								onMouseDown={e => selectOption(stateIndex, alphabetIndex, value)}
																							>q<sub>{value}</sub></div>)
																					})
																				}
																			</span>
																		</div>
																	</td>
																)
															})
														}
													</tr>
												)
											})
										}
									</tbody>
								</table>

								{ currentStep == 3 ? <button data-submit onClick={nextStep}>&#8594;</button> : <></> }
							</div>
						</section>
				}

				{
					currentStep < 4 ? <></> :
						<section data-start-state>
							<div data-input>
								<label htmlFor='state-count'>Select the start state for DFA:</label>

								<div data-select-single data-disabled={ currentStep > 4 }>
									{
										Array.from({ length: stateCount }, (_: unknown, i: number) => {
											return (
												<button
													data-sel={startState == i}
													key={`startState${i}`}
													onClick={() => selectStartState(i)}
												>q<sub>{i}</sub></button>
											)
										})
									}
								</div>
							</div>
						</section>
				}

				{
					currentStep < 5 ? <></> :
						<section data-accept-states>
							<div data-input>
								<label htmlFor='state-count'>Select the accept states for DFA:</label>

								<div data-select-multiple data-disabled={ currentStep > 5 }>
									{
										Array.from({ length: stateCount }, (_: unknown, i: number) => {
											return (
												<button
													data-sel={acceptStates.includes(i)}
													key={`acceptState${i}`}
													onClick={() => selectAcceptState(i)}
												>q<sub>{i}</sub></button>
											)
										})
									}
								</div>

								{ currentStep == 5 ? <button data-submit onClick={nextStep}>&#8594;</button> : <></> }
							</div>
						</section>
				}
			</main>
			
			<aside>
				{
					currentStep < 6 ? <></> :
						<>
							<label>Formal definition:</label>
							<pre data-formal-desc className={firaCode.className}>{formalDesc}</pre>

							<section>
								<div data-input>
									<label>Check a string against DFA:</label>

									<span>
										<input
											type='text'
											value={ DFAString }
											onChange={(props) => updateDFAString(props.target.value)}
										/>

										{
											res == 0 ?
												<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' data-fail>
													<path
														fill='currentColor'
														d='
															M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175
															175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4
															33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0
															33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9
															0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z
														'
													/>
												</svg>
											: res == 1 ?
												<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' data-success>
													<path
														fill='currentColor'
														d='
															M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241
															337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6
															0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4
															24.6 0 33.9z
														'
													/>
												</svg>
											:
												<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' data-warning>
													<path
														fill='currentColor'
														d='
															M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3
															27.7 .2 40.1S486.3 480 472 480L40 480c-14.3
															0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5
															241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3
															10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32
															224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z
														'
													/>
												</svg>
										}
									</span>
								</div>
							</section>
						</>
				}
			</aside>
		</>
	)
}
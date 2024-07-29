/** Class for building and processing deterministic finite automaton. */
export class DFA {
	/** The name of the class. */
	public static readonly className: string = 'DFA'

	private stateQuantity: number = 0
	private stateMatrix: Array<Array<number>> = []
	private startState: number = 0
	private passStates: Array<number> = []
	private alphabet: Array<string> = []

	/** Creates an instance of the DFA class. */
	constructor() {}

	/**
	 * Checks whether the string is recognized by the defined DFA.
	 * @param str - String to be checked against DFA.
	 * @returns Whether the string passes DFA or not.
	 * 
	 * @throws {TypeError} If the input is of incompatible type.
	 * @throws {RangeError} If the character in the input is outside of the defined alphabet.
	 */
	public checkString(str: string): boolean {
		if (typeof str != 'string') {
			throw new TypeError('Provided string must be of type string')
		}

		// Initialize current state and current chacter index
		let currentState = this.startState
		let currentCharIndex = 0

		// Loop through each character of the string, checking the character against the state matrix
		while (typeof str[currentCharIndex] == 'string') {
			const currentChar = str[currentCharIndex]

			// Get the column of the state matrix based on current character being processed
			const deltaColumn = this.alphabet.indexOf(currentChar)
			console.log(this.alphabet, currentChar)
			if (deltaColumn == -1) {
				throw new RangeError(`Character ${currentChar} is not within the alphabet`)
			}

			// Update current state and increment current character index
			currentState = this.stateMatrix[currentState][deltaColumn]
			currentCharIndex++
		}

		// Return whether language is recognized by DFA
		return this.passStates.includes(currentState)
	}

	/**
	 * Prepares the formal description of DFA.
	 * @returns Formal description of DFA.
	 */
	public getFormalDesc(): string {
		let res: string = ''

		res += `L = (Q, Σ, δ, ${this.getStartStateString()}, F) \n`
		res += `Q = {${this.getStatesString()}} \n`
		res += `Σ = {${this.alphabet.join(', ')}} \n`
		res += `F = {${this.passStates.join(', ')}} \n\n`

		res += `   δ    |   ${this.alphabet.join('    |   ')} \n`
		for (let rowIndex in this.stateMatrix) {
			const row = this.stateMatrix[rowIndex]

			res += `-`.repeat(12 + 8 * this.alphabet.length - 2) + '\n'
			res += `   q${rowIndex == '0' ? '₀' : rowIndex == '1' ? '₁' : rowIndex == '2' ? '₂' : rowIndex == '3' ? '₃' : rowIndex == '4' ? '₄' : rowIndex}`
			for (const columnIndex in row) {
				res += `   |   q${row[columnIndex] == 0 ? '₀' : row[columnIndex] == 1 ? '₁' : row[columnIndex] == 2 ? '₂' : row[columnIndex] == 3 ? '₃' : row[columnIndex] == 4 ? '₄' : row[columnIndex]}`
			}
			res += '\n'
		}

		return res
	}

	/** Resets DFA to default values. */
	public reset(): void {
		this.stateQuantity = 0
		this.stateMatrix = []
		this.startState = 0
		this.passStates = []
		this.alphabet = []
	}

	/**
	 * Returns the string representation of DFA class.
	 * @returns String representation of DFA class.
	 */
	public toString(): string {
		return this.getFormalDesc()
	}

	private getStatesString(): string {
		// Initialize the array that would store states as "q_" strings
		const stateArray = []

		// Loop through states, adding states to the array
		for (let i = 0; i < this.stateQuantity; i++) {
			stateArray.push(`q${i == 0 ? '₀' : i == 1 ? '₁' : i == 2 ? '₂' : i == 3 ? '₃' : i == 4 ? '₄' : i}`)
		}

		// Return states as a single string
		return `${stateArray.join(', ')}`
	}

	private getStartStateString(): string {
		return this.startState == 0 ? 'q₀' :
				this.startState == 1 ? 'q₁' :
				this.startState == 2 ? 'q₂' :
				this.startState == 3 ? 'q₃' :
				this.startState == 4 ? 'q₄' : `q${this.startState}`
	}

	/** Sets the quantity of states within DFA. */
	set StateQuantity(quantity: number) {
		this.stateQuantity = quantity
	}

	/** Sets the alphabet of DFA. */
	set Alphabet(alphabet: Array<string>) {
		this.alphabet = alphabet
	}

	/** Sets the state matrix of the DFA. */
	set StateMatrix(stateMatrix: Array<Array<number>>) {
		this.stateMatrix = stateMatrix
	}

	/** Sets the start state of the DFA. */
	set StartState(startState: number) {
		this.startState = startState
	}

	/** Sets the pass states of the DFA. */
	set PassStates(passStates: Array<number>) {
		this.passStates = passStates
	}
}
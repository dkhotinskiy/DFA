import './global.sass'

import { Metadata } from 'next'
import { Noto_Sans } from 'next/font/google'

const noto = Noto_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'DFA Checker',
	description:
		'Application for defining deterministic finite automaton ' +
		'and checking against some strings'
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className={noto.className}>{children}</body>
		</html>
	)
}
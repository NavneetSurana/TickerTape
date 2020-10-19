import Head from 'next/head'

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>tickerTape</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>TickerTape</h1>
      </main>
      <footer>
        2020 TickerTape
      </footer>
      
    </div>
  )
}

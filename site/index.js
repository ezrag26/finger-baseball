import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'

const OUTS_PER_INNING = 6

const Situation = ({ outs }) => {
  const inning = () => Math.floor(outs / OUTS_PER_INNING) + 1
  const isTopOfInning = () => (outs % OUTS_PER_INNING) < (OUTS_PER_INNING / 2)
  const outsThisInning = () => outs % 3

  return (
    <>
      <div><span>{isTopOfInning() ? 'Top' : 'Bottom'} {inning()}</span></div>
      <div><span>Outs: {outsThisInning()}</span></div>
    </>
  )
}

const Fingers = ({ onShoot, disabled }) => {

  return (
    <>
      {[1, 2, 3, 4, 5].map(num => <button key={num} onClick={() => onShoot(num)} disabled={disabled}>{num}</button>)}
    </>
  )
}

const Boxscore = ({ team, runs }) => {

  return (
    <>
      <div><span>{team}: {runs}</span></div>
    </>
  )
}

const Index = () => {
  const [outs, setOuts] = useState(0)
  const [awayRuns, setAwayRuns] = useState(0)
  const [homeRuns, setHomeRuns] = useState(0)
  const [awaySelection, setAwaySelection] = useState()
  const [homeSelection, setHomeSelection] = useState()

  useEffect(() => {
    if (awaySelection && homeSelection) {

      if (awaySelection !== homeSelection) setOuts(outs => ++outs)

      setAwaySelection(undefined)
      setHomeSelection(undefined)
    }
  }, [awaySelection, homeSelection])

  return (
    <>
      <Boxscore team={'Away'} runs={awayRuns}/>
      <Fingers onShoot={setAwaySelection} disabled={awaySelection}/>

      <Boxscore team={'Home'} runs={homeRuns}/>
      <Fingers onShoot={setHomeSelection} disabled={homeSelection}/>

      <Situation outs={outs}/>
      {/*<Matchup />*/}
    </>
  )
}

ReactDOM.render(<Index />, document.querySelector('#root'))
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'

const OUTS_PER_INNING = 6

const isTopOfInning = (outs) => (outs % OUTS_PER_INNING) < (OUTS_PER_INNING / 2)
const outsThisInning = (outs) => outs % 3

const Situation = ({ outs, bases }) => {
  const inning = () => Math.floor(outs / OUTS_PER_INNING) + 1
  const isTopOfInning = () => (outs % OUTS_PER_INNING) < (OUTS_PER_INNING / 2)
  const outsThisInning = () => outs % 3

  return (
    <div id={'situation'} style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div><span>{isTopOfInning() ? 'Top' : 'Bottom'} {inning()}</span></div>
        <div><span>Outs: {outsThisInning()}</span></div>
      </div>
      <div><span>{bases[1]}</span><span>{bases[2]}</span><span>{bases[3]}</span></div>
    </div>
  )
}

const Fingers = ({ onShoot, disabled }) => {

  return (
    <div className={'fingers'}>
      {[1, 2, 3, 4, 5].map(num => <button key={num} onClick={() => onShoot(num)} disabled={disabled}>{num}</button>)}
    </div>
  )
}

const Boxscore = ({ team, runs }) => {

  return (
    <div className={'boxscore'}>
      <div><span>{team}: {runs}</span></div>
    </div>
  )
}

const Bases = {
  new: () => {
    return {
      first: false,
      second: false,
      third: false,
      home: false
    }
  },
  copy: ({ obj }) => {
    return Object.keys(obj).reduce((reduced, base) => ({
      ...reduced, [base]: obj[base]
    }), {})
  }
}

const Index = () => {
  const [outs, setOuts] = useState(0)
  const [awayRuns, setAwayRuns] = useState(0)
  const [homeRuns, setHomeRuns] = useState(0)
  const [awaySelection, setAwaySelection] = useState()
  const [homeSelection, setHomeSelection] = useState()
  const [bases, setBases] = useState([0, 0, 0, 0])

  const advanceRunners = (selection, setRuns) => {
    const newBases = [...bases]

    const findFirstEmptyBase = () => newBases.indexOf(0, 1) // start at first base

    const pushRunners = () => {
      const openBase = findFirstEmptyBase()

      ++newBases[openBase === -1 ? 0 : openBase]

      return newBases[0]
    }

    const advanceAllRunners = () => {
      const numBases = newBases.length

      for (let i = numBases - 1; i > 0; --i) {
        if (newBases[i]) {
          newBases[i] = 0
          ++newBases[(i + selection) >= numBases ? 0 : i + selection]
        }
      }

      ++newBases[selection % 4]

      return newBases[0]
    }

    const walk = () => selection === 5

    setRuns(runs => runs + walk() ? pushRunners() : advanceAllRunners())

    newBases[0] = 0 // reset runs scored for next play
    setBases(newBases)
  }

  useEffect(() => {
    if (outsThisInning(outs) === 0) setBases([0, 0, 0, 0])
  }, [outs])

  useEffect(() => {
    if (awaySelection && homeSelection) {

      if (awaySelection !== homeSelection) setOuts(outs => ++outs)
      else advanceRunners(awaySelection, isTopOfInning(outs) ? setAwayRuns : setHomeRuns)

      setAwaySelection(null)
      setHomeSelection(null)
    }
  }, [awaySelection, homeSelection])

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <div>
          <Fingers onShoot={setAwaySelection} disabled={awaySelection}/>
          <Boxscore team={'Away'} runs={awayRuns}/>
        </div>

        <Situation outs={outs} bases={bases}/>
        {/*<Matchup />*/}

        <div>
          <Fingers onShoot={setHomeSelection} disabled={homeSelection}/>
          <Boxscore team={'Home'} runs={homeRuns}/>
        </div>
      </div>
    </>
  )
}

ReactDOM.render(<Index />, document.querySelector('#root'))
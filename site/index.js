import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'

const randomBits = () => Math.random().toString(36).slice(2)

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
      <div><span>{bases.first ? 1 : 0}</span><span>{bases.second ? 1 : 0}</span><span>{bases.third ? 1 : 0}</span></div>
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
  new: ({ atBat }) => {
    return {
      // first: undefined,
      // second: undefined,
      // third: undefined,
      home: { onBase: atBat }
    }
  }
}

const BASES = ['first', 'second', 'third', 'home']

const Index = () => {
  const [outs, setOuts] = useState(0)
  const [awayRuns, setAwayRuns] = useState(0)
  const [homeRuns, setHomeRuns] = useState(0)
  const [awaySelection, setAwaySelection] = useState()
  const [homeSelection, setHomeSelection] = useState()
  const [bases, setBases] = useState(Bases.new({ atBat: randomBits() }))

  const advanceRunners = (selection, setRuns) => {
    const updatedBases = {...bases}

    const findFirstEmptyBase = () => BASES.reduce((emptyBase, current) => emptyBase === 'home' ? (updatedBases[current] ? emptyBase : current) : emptyBase, 'home')

    const pushRunners = () => {
      const openBase = BASES.indexOf(findFirstEmptyBase())
      const home = updatedBases.home
      updatedBases.home = {}

      for (let i = openBase; i > 0; --i) {
        updatedBases[BASES[i]] = updatedBases[BASES[i - 1]]
      }

      updatedBases.first = home

      return updatedBases.home.onBase ? 1 : 0
    }

    const advanceAllRunners = () => {
      const NUM_BASES = BASES.length
      let runsScored = 0

      for (let i = NUM_BASES - 2; i >= 0; --i) {
        if (updatedBases[BASES[i]]) {
          if (i + selection + 1 >= NUM_BASES) ++runsScored
          else updatedBases[BASES[i + selection]] = updatedBases[BASES[i]]

          updatedBases[BASES[i]] = undefined
        }
      }

      if (selection === NUM_BASES) ++runsScored
      else updatedBases[BASES[selection - 1]] = updatedBases.home

      updatedBases.home = {}

      return runsScored
    }

    const walk = () => selection === 5

    setRuns(runs => runs + (walk() ? pushRunners() : advanceAllRunners()))
    setBases(updatedBases)
  }

  useEffect(() => {
    if (outsThisInning(outs) === 0) setBases(Bases.new({ atBat: randomBits() }))
  }, [outs])

  useEffect(() => {
    if (awaySelection && homeSelection) {

      if (awaySelection !== homeSelection) setOuts(outs => ++outs)
      else advanceRunners(awaySelection, isTopOfInning(outs) ? setAwayRuns : setHomeRuns)

      setAwaySelection(null)
      setHomeSelection(null)
      setBases(bases => ({ ...bases, home: { onBase: randomBits() } }))
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
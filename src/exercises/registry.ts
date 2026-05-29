import type { ComponentType } from 'react'
import type { ExerciseProps } from './types'
import SaccadesPursuit from './SaccadesPursuit'
import PencilPushup from './PencilPushup'
import BrockString from './BrockString'
import ConvergenceTarget from './ConvergenceTarget'
import FreeFusion from './FreeFusion'
import HartChart from './HartChart'
import FlipperTimer from './FlipperTimer'
import DistanceGaze from './DistanceGaze'
import Tranaglyph from './anaglyph/Tranaglyph'
import AntiSuppressionGame from './anaglyph/AntiSuppressionGame'
import Stereogram from './anaglyph/Stereogram'

export const EXERCISE_COMPONENTS: Record<string, ComponentType<ExerciseProps>> = {
  SaccadesPursuit,
  PencilPushup,
  BrockString,
  ConvergenceTarget,
  FreeFusion,
  HartChart,
  FlipperTimer,
  DistanceGaze,
  Tranaglyph,
  AntiSuppressionGame,
  Stereogram,
}

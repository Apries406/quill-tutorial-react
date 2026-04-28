import React, { useState, useEffect, useCallback } from 'react'
import { buildSteps, getActiveSteps, getStepIndex, getTotalSteps } from '../data/buildSteps'
import { stepThinking } from '../data/stepThinking'
import { stepSections } from '../data/stepSections'
import StepNav from '../components/build/StepNav'
import StepContent from '../components/build/StepContent'
import StepNavigation from '../components/build/StepNavigation'
import * as Demos from '../components/build/demos'

export default function BuildPage() {
  const [currentStep, setCurrentStep] = useState('init')

  const activeSteps = getActiveSteps()
  const totalSteps = getTotalSteps()
  const currentIndex = getStepIndex(currentStep)
  const currentStepData = buildSteps.find(s => s.key === currentStep)

  const handleStepChange = useCallback((key) => {
    const step = buildSteps.find(s => s.key === key)
    if (step && !step.disabled) {
      setCurrentStep(key)
    }
  }, [])

  const handlePrev = useCallback(() => {
    const currentIdx = activeSteps.findIndex(s => s.key === currentStep)
    if (currentIdx > 0) {
      setCurrentStep(activeSteps[currentIdx - 1].key)
    }
  }, [currentStep, activeSteps])

  const handleNext = useCallback(() => {
    const currentIdx = activeSteps.findIndex(s => s.key === currentStep)
    if (currentIdx < activeSteps.length - 1) {
      setCurrentStep(activeSteps[currentIdx + 1].key)
    }
  }, [currentStep, activeSteps])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrev()
      } else if (e.key === 'ArrowRight') {
        handleNext()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlePrev, handleNext])

  const DemoComponent = currentStepData?.demo ? Demos[currentStepData.demo] : null

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
      <StepNav currentStep={currentStep} onStepChange={handleStepChange} />

      <StepContent
        step={currentStepData}
        thinking={stepThinking[currentStep]}
        sections={stepSections[currentStep]}
        demo={DemoComponent}
      />

      <StepNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        currentIndex={currentIndex}
        onPrev={handlePrev}
        onNext={handleNext}
        hasPrev={currentIndex > 0}
        hasNext={currentIndex < totalSteps - 1}
      />
    </div>
  )
}

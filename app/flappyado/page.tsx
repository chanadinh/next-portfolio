'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface GameObject {
  x: number
  y: number
  width: number
  height: number
}

interface Pipe extends GameObject {
  passed: boolean
  scored?: boolean
}

interface GameState {
  isPlaying: boolean
  score: number
  highScore: number
  gameOver: boolean
}

interface HighScore {
  _id: string
  name: string
  score: number
  userIP: string
  createdAt: string
}

const GAME_CONFIG = {
  GRAVITY: 0.6,
  FLAP_FORCE: -8,
  PIPE_SPEED: 2,
  PIPE_SPAWN_RATE: 100,
  BASE_PIPE_GAP: 280,
  GROUND_HEIGHT: 100,
  PLAYER_SIZE: 80,
  PIPE_WIDTH: 60,
  MIN_PIPE_GAP: 220,
  MIN_PIPE_DISTANCE: 200
}

export default function FlappyAdo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const lastTimeRef = useRef<number>(0)
  const audioContextRef = useRef<AudioContext>()
  const playerImageRef = useRef<HTMLImageElement>()
  
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    score: 0,
    highScore: 0,
    gameOver: false
  })
  
  const [player, setPlayer] = useState({
    x: 400,
    y: 300,
    velocity: 0,
    rotation: 0
  })
  
  const [pipes, setPipes] = useState<Pipe[]>([])
  const [ground, setGround] = useState(0)
  const [lastPipeSpawn, setLastPipeSpawn] = useState(-5000)
  const [particles, setParticles] = useState<Array<{x: number, y: number, vx: number, vy: number, life: number}>>([])
  
  // Score saving state
  const [userIP, setUserIP] = useState<string>('')
  const [showNameInput, setShowNameInput] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [topScores, setTopScores] = useState<HighScore[]>([])
  const [isSavingScore, setIsSavingScore] = useState(false)
  const [existingPlayerName, setExistingPlayerName] = useState<string>('')
  const [hasPlayedBefore, setHasPlayedBefore] = useState(false)
  const [personalBest, setPersonalBest] = useState<number>(0)
  const [scoresLoaded, setScoresLoaded] = useState(false)
  const [playerRank, setPlayerRank] = useState<number>(0)

  // Load player image and set initial position
  useEffect(() => {
    const img = new window.Image()
    img.src = '/images/ado.png'
    img.onload = () => {
      playerImageRef.current = img
    }

    // Set player position after component mounts (client-side only)
    if (typeof window !== 'undefined') {
      setPlayer(prev => ({
        ...prev,
        x: window.innerWidth / 3,
        y: window.innerHeight / 2
      }))
    }
  }, [])

  // Audio state for background music
  const [backgroundAudio, setBackgroundAudio] = useState<HTMLAudioElement | null>(null)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [clickSpeed, setClickSpeed] = useState<number>(0)
  const [lastClickTime, setLastClickTime] = useState<number>(0)
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false)
  const [showDashboard, setShowDashboard] = useState<boolean>(false)

  // Initialize audio context and background music
  useEffect(() => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    setAudioContext(ctx)
    
    // Create background audio element
    const audio = new Audio('/audio/background-music.mp3') // You'll need to add this file
    audio.loop = true
    audio.volume = 0.3
    
    // Handle audio loading errors gracefully
    audio.onerror = () => {
      console.warn('⚠️ Background music file not found. Please add /audio/background-music.mp3 to your public folder.')
      setBackgroundAudio(null)
    }
    
    audio.oncanplaythrough = () => {
      setBackgroundAudio(audio)
      console.log('✅ Background music loaded successfully')
    }
    
    return () => {
      if (ctx) {
        ctx.close()
      }
      if (audio) {
        audio.pause()
        audio.src = ''
      }
    }
  }, [])

  // Get user IP and load top scores
  useEffect(() => {
    const getUserIP = async () => {
      try {
        const response = await fetch('/api/flappyado/ip')
        const data = await response.json()
        if (data.success) {
          setUserIP(data.ip)
        }
      } catch (error) {
        console.error('Error getting IP:', error)
        setUserIP('unknown')
      }
    }

    const loadTopScores = async () => {
      try {
        const response = await fetch('/api/flappyado/scores')
        const data = await response.json()
        if (data.success) {
          setTopScores(data.scores)
          // Set local high score from MongoDB top scores (use raw score as-is)
          if (data.scores.length > 0) {
            const globalHighScore = data.scores[0].score
            setGameState(prev => ({ ...prev, highScore: globalHighScore }))
            console.log('🏆 Updated global high score from MongoDB:', globalHighScore)
          }
          setScoresLoaded(true)
        }
      } catch (error) {
        console.error('Error loading top scores:', error)
        setScoresLoaded(true) // Set to true even on error to prevent infinite loading
      }
    }

    const checkExistingPlayer = async () => {
      if (!userIP) return
      
      try {
        const response = await fetch(`/api/flappyado/scores?ip=${userIP}`)
        const data = await response.json()
        if (data.success && data.scores.length > 0) {
          // IP exists in MongoDB - player has already entered a name before
          // Find the highest score for this IP (scores are already sorted by score desc)
          const highestScore = data.scores[0]
          setExistingPlayerName(highestScore.name)
          setHasPlayedBefore(true)
          
          // Set personal best from MongoDB (use raw score as-is)
          setPersonalBest(highestScore.score)
          
          console.log('👤 IP found in MongoDB - existing player:', highestScore.name, 'Best score:', highestScore.score)
        } else {
          // IP not found in MongoDB - new player, needs to enter name
          console.log('🆕 IP not in MongoDB - new player, will show name input')
          setHasPlayedBefore(false)
          setExistingPlayerName('')
          setPersonalBest(0) // Reset personal best for new players
        }
      } catch (error) {
        console.error('Error checking existing player:', error)
        setHasPlayedBefore(false)
        setExistingPlayerName('')
        setPersonalBest(0)
      }
    }

    getUserIP()
    loadTopScores()
    
    // Check existing player after IP is loaded
    if (userIP) {
      checkExistingPlayer()
    }
  }, [userIP])

  // Calculate player's rank in the leaderboard
  const calculatePlayerRank = useCallback(() => {
    if (!hasPlayedBefore || personalBest === 0) {
      setPlayerRank(0)
      return
    }
    
    const rank = topScores.findIndex(score => score.score <= personalBest) + 1
    setPlayerRank(rank > 0 ? rank : topScores.length + 1)
  }, [hasPlayedBefore, personalBest, topScores])

  // Update player rank when scores change
  useEffect(() => {
    calculatePlayerRank()
  }, [calculatePlayerRank])

  // Refresh existing player data after score changes
  const refreshExistingPlayer = useCallback(async () => {
    if (!userIP) return
    
    try {
      const response = await fetch(`/api/flappyado/scores?ip=${userIP}`)
      const data = await response.json()
      if (data.success && data.scores.length > 0) {
        const existingScore = data.scores[0]
        setExistingPlayerName(existingScore.name)
        setHasPlayedBefore(true)
        
        // Update personal best from MongoDB (use raw score as-is)
        setPersonalBest(existingScore.score)
        
        console.log('🔄 Refreshed existing player data:', existingScore.name, 'Score:', existingScore.score)
      } else {
        // No scores found for this IP (shouldn't happen for existing players)
        console.log('🔄 No scores found for IP during refresh')
        setHasPlayedBefore(false)
        setExistingPlayerName('')
        setPersonalBest(0)
      }
    } catch (error) {
      console.error('Error refreshing existing player:', error)
    }
  }, [userIP])

  // Debug: Monitor showNameInput changes
  useEffect(() => {
    console.log('🔄 showNameInput changed to:', showNameInput)
  }, [showNameInput])

  // Save high score to MongoDB
  const saveHighScore = useCallback(async (name: string, score: number) => {
    if (!userIP) return false
    if (!name || !name.trim()) return false
    
    setIsSavingScore(true)
    try {
      const response = await fetch('/api/flappyado/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          score,
          userIP
        }),
      })

      const data = await response.json()
      if (data.success) {
        setTopScores(data.topScores)
        
        // Log the result
        if (data.updatedScore) {
          console.log('📝 Updated existing record successfully')
        } else if (data.newScore) {
          console.log('🆕 Created new record successfully')
        }
        
        // Refresh existing player data to keep state in sync with MongoDB
        await refreshExistingPlayer()
        
        return true
      } else {
        console.log('Score not saved:', data.message)
        return false
      }
    } catch (error) {
      console.error('Error saving score:', error)
      return false
    } finally {
      setIsSavingScore(false)
    }
  }, [userIP, refreshExistingPlayer])



  // Play sound effect
  const playSound = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (!audioContextRef.current) return
    
    const oscillator = audioContextRef.current.createOscillator()
    const gainNode = audioContextRef.current.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContextRef.current.destination)
    
    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime)
    oscillator.type = type
    
    gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration)
    
    oscillator.start(audioContextRef.current.currentTime)
    oscillator.stop(audioContextRef.current.currentTime + duration)
  }, [])

  // Create particle effect
  const createParticles = useCallback((x: number, y: number, count: number = 5) => {
    const newParticles = Array.from({ length: count }, () => ({
      x: x + Math.random() * 20 - 10,
      y: y + Math.random() * 20 - 10,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      life: 1
    }))
    setParticles(prev => [...prev, ...newParticles])
  }, [])

  // Handle game over
  const handleGameOver = useCallback(async () => {
    const finalScore = Math.floor(gameState.score / 2)
    const rawScore = gameState.score
    
    // Stop background music
    if (backgroundAudio && isMusicPlaying) {
      try {
        backgroundAudio.pause()
        backgroundAudio.currentTime = 0
        setIsMusicPlaying(false)
        console.log('🎵 Background music stopped')
      } catch (error) {
        console.error('Error stopping background music:', error)
      }
    }
    
    console.log('🎮 Game Over!')
    console.log('📊 Raw Score:', rawScore)
    console.log('📊 Final Score (divided by 2):', finalScore)
    console.log('🏆 High Score from MongoDB:', gameState.highScore)
    console.log('🔍 Current showNameInput state:', showNameInput)
    console.log('👤 Has played before:', hasPlayedBefore)
    console.log('👤 Existing player name:', existingPlayerName)
    
    if (hasPlayedBefore) {
      // IP exists in MongoDB - player has already entered a name before
      // Auto-save score with their existing name (only if higher)
      // Store raw score in MongoDB, not divided score
      console.log('👤 IP exists in MongoDB - auto-saving score with existing name:', existingPlayerName)
      const saved = await saveHighScore(existingPlayerName, rawScore)
      if (saved) {
        console.log('✅ Score auto-saved for existing player')
      } else {
        console.log('❌ Failed to auto-save score')
      }
    } else {
      // IP not found in MongoDB - new player, needs to enter name
      // Don't save here - let the name input dialog handle the first save
      console.log('🆕 IP not in MongoDB - new player, showing name input...')
      setShowNameInput(true)
      console.log('✅ setShowNameInput(true) called')
    }
  }, [gameState.score, gameState.highScore, showNameInput, hasPlayedBefore, existingPlayerName, saveHighScore, backgroundAudio, isMusicPlaying])



  // Initialize game
  const initGame = useCallback(async () => {
    const safeX = typeof window !== 'undefined' ? window.innerWidth / 3 : 400
    const safeY = typeof window !== 'undefined' ? window.innerHeight / 2 : 300
    
    setPlayer({
      x: safeX,
      y: safeY,
      velocity: 0,
      rotation: 0
    })
    setPipes([])
    setGround(0)
    setLastPipeSpawn(-5000)
    setParticles([])
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      score: 0,
      gameOver: false
    }))
    
    // Refresh top scores and high score from MongoDB
    try {
      const response = await fetch('/api/flappyado/scores')
      const data = await response.json()
      if (data.success) {
        setTopScores(data.scores)
        if (data.scores.length > 0) {
          // Use raw score from MongoDB (no division needed)
          const globalHighScore = data.scores[0].score
          setGameState(prev => ({ ...prev, highScore: globalHighScore }))
          console.log('🏆 Game start - Updated global high score from MongoDB:', globalHighScore)
        }
        setScoresLoaded(true)
      }
    } catch (error) {
      console.error('Error refreshing scores:', error)
      setScoresLoaded(true) // Set to true even on error
    }
    
    // Start background music
    if (backgroundAudio && audioContext) {
      try {
        backgroundAudio.play()
        setIsMusicPlaying(true)
        console.log('🎵 Background music started')
      } catch (error) {
        console.error('Error starting background music:', error)
      }
    }
    
    // Play start sound
    playSound(440, 0.2)
  }, [playSound, backgroundAudio, audioContext])

  // Calculate click speed and manipulate background music
  const calculateClickSpeed = useCallback(() => {
    const now = Date.now()
    const timeDiff = now - lastClickTime
    
    if (timeDiff > 0) {
      const clicksPerSecond = 1000 / timeDiff
      setClickSpeed(clicksPerSecond)
      
      // Manipulate background music pitch based on click speed
      if (backgroundAudio && audioContext && isMusicPlaying) {
        manipulateBackgroundMusic(clicksPerSecond)
      }
    }
    
    setLastClickTime(now)
  }, [lastClickTime, backgroundAudio, audioContext, isMusicPlaying])

  // Manipulate background music pitch based on click speed
  const manipulateBackgroundMusic = useCallback((speed: number) => {
    if (!backgroundAudio || !audioContext) return
    
    try {
      // Create audio source from background audio
      const source = audioContext.createMediaElementSource(backgroundAudio)
      const gainNode = audioContext.createGain()
      const pitchShift = audioContext.createBiquadFilter()
      
      // Configure pitch shifting based on click speed (optimized for 0-4 clicks/sec range)
      const basePitch = 1.0 // Normal pitch
      
      // Map click speed to pitch factor with better range for 0-4 clicks/sec
      let speedFactor
      if (speed <= 0.5) {
        speedFactor = 0.3 // Very slow = very low pitch
      } else if (speed <= 1.0) {
        speedFactor = 0.5 // Slow = low pitch
      } else if (speed <= 2.0) {
        speedFactor = 0.8 // Medium-slow = slightly low pitch
      } else if (speed <= 3.0) {
        speedFactor = 1.2 // Medium-fast = slightly high pitch
      } else if (speed <= 4.0) {
        speedFactor = 1.6 // Fast = high pitch
      } else {
        speedFactor = 2.0 // Very fast = very high pitch (capped)
      }
      
      const newPitch = basePitch * speedFactor
      
      // Apply pitch shift using filter
      pitchShift.type = 'lowpass'
      pitchShift.frequency.value = 2000 * newPitch
      pitchShift.Q.value = 1
      
      // Connect audio nodes
      source.connect(pitchShift)
      pitchShift.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      // Adjust volume based on speed (more dramatic for better effect)
      const volumeFactor = Math.max(0.1, 1.0 - (speed / 8)) // Volume decreases with speed
      gainNode.gain.value = 0.4 * volumeFactor
      
      console.log('🎵 Music pitch adjusted:', newPitch.toFixed(2), 'Speed factor:', speedFactor.toFixed(2), 'Volume:', volumeFactor.toFixed(2))
    } catch (error) {
      console.error('Error manipulating background music:', error)
    }
  }, [backgroundAudio, audioContext])

  // Flap function
  const flap = useCallback(() => {
    if (!gameState.isPlaying || gameState.gameOver) return
    
    setPlayer(prev => ({
      ...prev,
      velocity: GAME_CONFIG.FLAP_FORCE,
      rotation: -20
    }))
    
    // Create flap particles
    createParticles(player.x + GAME_CONFIG.PLAYER_SIZE / 2, player.y + GAME_CONFIG.PLAYER_SIZE / 2, 3)
    
    // Calculate click speed and manipulate music
    calculateClickSpeed()
    
    // Play subtle flap sound (reduced volume since we have background music)
    playSound(800, 0.05, 'sine')
  }, [gameState.isPlaying, gameState.gameOver, player.x, player.y, createParticles, playSound, calculateClickSpeed])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        flap()
      }
      
      // Toggle dashboard with 'D' key
      if (e.code === 'KeyD' && gameState.isPlaying) {
        e.preventDefault()
        setShowDashboard(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [flap, gameState.isPlaying])

  // Handle mouse/touch input
  const handleCanvasClick = useCallback(() => {
    flap()
  }, [flap])

  // Game loop
  const gameLoop = useCallback((currentTime: number) => {
    if (!gameState.isPlaying || gameState.gameOver) return

    const deltaTime = currentTime - lastTimeRef.current
    lastTimeRef.current = currentTime

    // Update particles
    setParticles(prev => 
      prev
        .map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          life: particle.life - 0.02
        }))
        .filter(particle => particle.life > 0)
    )

    // Update player
    setPlayer(prev => {
      const newVelocity = prev.velocity + GAME_CONFIG.GRAVITY
      const newY = prev.y + newVelocity
      const newRotation = Math.min(90, prev.rotation + 2)

      // Check ground collision
      if (newY + GAME_CONFIG.PLAYER_SIZE > window.innerHeight - GAME_CONFIG.GROUND_HEIGHT) {
        setGameState(prevState => ({
          ...prevState,
          gameOver: true,
          isPlaying: false
        }))
        
        // Create ground hit particles
        createParticles(prev.x + GAME_CONFIG.PLAYER_SIZE / 2, window.innerHeight - GAME_CONFIG.GROUND_HEIGHT, 8)
        
        // Play crash sound
        playSound(200, 0.5, 'sawtooth')
        
        // Handle game over logic immediately
        handleGameOver()
        
        return prev
      }

      return {
        ...prev,
        y: newY,
        velocity: newVelocity,
        rotation: newRotation
      }
    })

    // Update pipes
    setPipes(prev => {
      const updatedPipes = prev
        .map(pipe => ({
          ...pipe,
          x: pipe.x - GAME_CONFIG.PIPE_SPEED
        }))
        .filter(pipe => pipe.x + GAME_CONFIG.PIPE_WIDTH > 0)

      return updatedPipes
    })

    // Spawn new pipes with proper spacing
    if (currentTime - lastPipeSpawn > GAME_CONFIG.PIPE_SPAWN_RATE) {
      // Check if there's enough space before spawning new pipes
      const lastPipeX = pipes.length > 0 ? Math.max(...pipes.map(p => p.x)) : 0
      const safeWidth = typeof window !== 'undefined' ? window.innerWidth : 1200
      const distanceFromLastPipe = safeWidth - lastPipeX
      
      if (distanceFromLastPipe >= GAME_CONFIG.MIN_PIPE_DISTANCE) {
        // Calculate dynamic pipe gap based on score - starts BIG, gets TIGHTER (harder) as score increases
        const currentPipeGap = Math.max(
          GAME_CONFIG.MIN_PIPE_GAP,
          GAME_CONFIG.BASE_PIPE_GAP - (gameState.score * 3)
        )
        
        const pipeHeight = Math.random() * (window.innerHeight - GAME_CONFIG.GROUND_HEIGHT - currentPipeGap - 100) + 50
        
        setPipes(prev => [
          ...prev,
          {
            x: safeWidth,
            y: 0,
            width: GAME_CONFIG.PIPE_WIDTH,
            height: pipeHeight,
            passed: false,
            scored: false
          },
          {
            x: safeWidth,
            y: pipeHeight + currentPipeGap,
            width: GAME_CONFIG.PIPE_WIDTH,
            height: (typeof window !== 'undefined' ? window.innerHeight : 800) - GAME_CONFIG.GROUND_HEIGHT - pipeHeight - currentPipeGap,
            passed: false,
            scored: false
          }
        ])
        
        setLastPipeSpawn(currentTime)
      }
    }

    // Check pipe collisions and scoring
    setPipes(prev => {
      const updatedPipes = prev.map(pipe => {
        // Check collision with player
        if (
          player.x < pipe.x + pipe.width &&
          player.x + GAME_CONFIG.PLAYER_SIZE > pipe.x &&
          player.y < pipe.y + pipe.height &&
          player.y + GAME_CONFIG.PLAYER_SIZE > pipe.y
        ) {
          setGameState(prevState => ({
            ...prevState,
            gameOver: true,
            isPlaying: false
          }))
          
          // Create collision particles
          createParticles(player.x + GAME_CONFIG.PLAYER_SIZE / 2, player.y + GAME_CONFIG.PLAYER_SIZE / 2, 10)
          
          // Play crash sound
          playSound(150, 0.3, 'sawtooth')
          
          // Handle game over logic immediately
          handleGameOver()
        }

        // Check if pipe passed for scoring
        if (!pipe.passed && pipe.x + pipe.width < player.x) {
          return { ...pipe, passed: true }
        }

        return pipe
      })

      // Score only once per pipe pair (when both pipes are passed)
      const pipePairs = []
      for (let i = 0; i < updatedPipes.length; i += 2) {
        if (i + 1 < updatedPipes.length) {
          pipePairs.push([updatedPipes[i], updatedPipes[i + 1]])
        }
      }

      pipePairs.forEach(([topPipe, bottomPipe]) => {
        if (topPipe.passed && bottomPipe.passed && !topPipe.scored && !bottomPipe.scored) {
          // Mark both pipes as scored to prevent double counting
          topPipe.scored = true
          bottomPipe.scored = true
          
          // Increment score by 1 (will be divided by 2 for display)
          setGameState(prevState => {
            console.log(`🎯 Scoring! New score: ${prevState.score + 1}, Pipe pair at x: ${bottomPipe.x}`)
            return {
              ...prevState,
              score: prevState.score + 1
            }
          })
          
          // Create score particles
          createParticles(bottomPipe.x + bottomPipe.width, player.y + GAME_CONFIG.PLAYER_SIZE / 2, 5)
          
          // Play score sound
          playSound(1000 + (gameState.score * 50), 0.15, 'triangle')
        }
      })

      return updatedPipes
    })

    // Update ground
    setGround(prev => (prev + GAME_CONFIG.PIPE_SPEED) % 50)

    animationRef.current = requestAnimationFrame(gameLoop)
  }, [gameState.isPlaying, gameState.gameOver, player.x, player.y, lastPipeSpawn, createParticles, playSound, gameState.score])

  // Start game loop
  useEffect(() => {
    if (gameState.isPlaying && !gameState.gameOver) {
      animationRef.current = requestAnimationFrame(gameLoop)
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameState.isPlaying, gameState.gameOver, gameLoop])

  // Update high score
  useEffect(() => {
    if (gameState.score > gameState.highScore) {
      setGameState(prev => ({
        ...prev,
        highScore: gameState.score
      }))
      
      // Play high score sound
      if (gameState.score > 0) {
        playSound(1200, 0.3, 'sine')
      }
    }
  }, [gameState.score, gameState.highScore, playSound])

  // Render game
  const renderGame = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set canvas dimensions (safe for SSR)
    if (typeof window !== 'undefined') {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    } else {
      canvas.width = 1200
      canvas.height = 800
    }

    // Draw background - Bright colorful style
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, '#00CED1')  // Bright teal/cyan sky
    gradient.addColorStop(0.7, '#40E0D0') // Lighter teal
    gradient.addColorStop(1, '#98FB98')   // Light green near ground
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw white clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    for (let i = 0; i < 5; i++) {
      const x = (i * 200 + ground * 0.3) % (canvas.width + 100)
      const y = 50 + Math.sin(i * 0.7) * 20
      ctx.beginPath()
      ctx.arc(x, y, 30, 0, Math.PI * 2)
      ctx.arc(x + 25, y, 25, 0, Math.PI * 2)
      ctx.arc(x + 50, y, 20, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw pipes with bright green style
    pipes.forEach(pipe => {
      // Main pipe body - bright green gradient
      const pipeGradient = ctx.createLinearGradient(pipe.x, pipe.y, pipe.x + pipe.width, pipe.y + pipe.height)
      pipeGradient.addColorStop(0, '#32CD32')  // Lime green
      pipeGradient.addColorStop(1, '#228B22')  // Forest green
      ctx.fillStyle = pipeGradient
      ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height)
      
      // Pipe outline - dark green border
      ctx.strokeStyle = '#006400'
      ctx.lineWidth = 3
      ctx.strokeRect(pipe.x, pipe.y, pipe.width, pipe.height)
      
      // Pipe cap with bright green accents
      const capHeight = 25
      if (pipe.y === 0) {
        // Top pipe cap - bright green with highlights
        ctx.fillStyle = '#90EE90'
        ctx.fillRect(pipe.x - 8, pipe.height - capHeight, pipe.width + 16, capHeight)
        ctx.strokeStyle = '#006400'
        ctx.strokeRect(pipe.x - 8, pipe.height - capHeight, pipe.width + 16, capHeight)
        
        // Bright highlight line
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
        ctx.fillRect(pipe.x - 6, pipe.height - capHeight + 2, pipe.width + 12, 2)
      } else {
        // Bottom pipe cap
        ctx.fillStyle = '#90EE90'
        ctx.fillRect(pipe.x - 8, pipe.y, pipe.width + 16, capHeight)
        ctx.strokeStyle = '#006400'
        ctx.strokeRect(pipe.x - 8, pipe.y, pipe.width + 16, capHeight)
        
        // Bright highlight line
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
        ctx.fillRect(pipe.x - 6, pipe.y + 2, pipe.width + 12, 2)
      }
    })

    // Draw particles
    particles.forEach(particle => {
      ctx.save()
      ctx.globalAlpha = particle.life
      ctx.fillStyle = '#FFD700'
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    })

    // Draw ground - Yellow style
    const groundGradient = ctx.createLinearGradient(0, canvas.height - GAME_CONFIG.GROUND_HEIGHT, 0, canvas.height)
    groundGradient.addColorStop(0, '#F4D03F')  // Light yellow
    groundGradient.addColorStop(1, '#F39C12')  // Orange-yellow
    ctx.fillStyle = groundGradient
    ctx.fillRect(0, canvas.height - GAME_CONFIG.GROUND_HEIGHT, canvas.width, GAME_CONFIG.GROUND_HEIGHT)

    // Draw yellow landscape/hills pattern
    ctx.fillStyle = 'rgba(230, 126, 34, 0.8)'  // Darker orange-yellow
    for (let i = 0; i < canvas.width; i += 40) {
      const patternHeight = 15 + Math.sin(i * 0.06 + ground * 0.03) * 8
      ctx.fillRect(i, canvas.height - GAME_CONFIG.GROUND_HEIGHT - patternHeight, 35, patternHeight)
    }

    // Draw player (ado.png image)
    if (playerImageRef.current) {
      ctx.save()
      ctx.translate(player.x + GAME_CONFIG.PLAYER_SIZE / 2, player.y + GAME_CONFIG.PLAYER_SIZE / 2)
      ctx.rotate((player.rotation * Math.PI) / 180)
      
      // Draw the ado.png image
      ctx.drawImage(
        playerImageRef.current,
        -GAME_CONFIG.PLAYER_SIZE / 2,
        -GAME_CONFIG.PLAYER_SIZE / 2,
        GAME_CONFIG.PLAYER_SIZE,
        GAME_CONFIG.PLAYER_SIZE
      )
      
      ctx.restore()
    }

    // Draw score with bright style
    const displayScore = Math.floor(gameState.score / 2)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
    ctx.font = 'bold 48px "Comic Sans MS", cursive'
    ctx.textAlign = 'center'
    ctx.fillText(displayScore.toString(), canvas.width / 2 + 3, 103)
    
    ctx.fillStyle = '#FF4500'  // Orange red
    ctx.fillText(displayScore.toString(), canvas.width / 2, 100)
    
    // Draw high score with bright style (convert raw MongoDB score to display score)
    const displayHighScore = Math.floor(gameState.highScore / 2)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
    ctx.font = 'bold 24px "Comic Sans MS", cursive'
    ctx.fillText(`High Score: ${displayHighScore}`, canvas.width / 2 + 1, 151)
    
    ctx.fillStyle = '#FF8C00'  // Dark orange
    ctx.fillText(`High Score: ${displayHighScore}`, canvas.width / 2, 150)
    
    // Debug: Log the high score being drawn on canvas
    if (gameState.score % 60 === 0) { // Log every 60 frames (about once per second)
      console.log('🎨 Canvas drawing - Raw High Score:', gameState.highScore, 'Display High Score:', displayHighScore)
    }
  }

  // Render game on canvas
  useEffect(() => {
    renderGame()
  }, [player, pipes, ground, gameState.score, gameState.highScore, particles])

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-cyan-400 to-yellow-300 overflow-hidden">
      {/* Game Canvas */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full h-full cursor-pointer"
        style={{ display: gameState.isPlaying ? 'block' : 'none' }}
      />

      {/* Start Screen */}
      {!gameState.isPlaying && !gameState.gameOver && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-cyan-400 via-teal-300 to-yellow-300"
        >
          <div className="text-center text-gray-800">
            <motion.div
              initial={{ y: -50, rotate: -10 }}
              animate={{ y: 0, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="mb-8"
            >
              <Image
                src="/images/ado.png"
                alt="Ado Character"
                width={160}
                height={160}
                className="rounded-full border-4 border-gray-800 shadow-lg"
              />
            </motion.div>
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-6xl font-bold mb-4"
              style={{ 
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                fontFamily: '"Fredoka One", cursive'
              }}
            >
              Flappy Ado
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl mb-8"
              style={{ fontFamily: '"Sniglet", cursive' }}
            >
              Help Ado fly through the pipes!
            </motion.p>
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={initGame}
              className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg text-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-red-400"
              style={{ fontFamily: '"Sniglet", cursive' }}
            >
              Start Game
            </motion.button>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-4 text-lg opacity-80"
              style={{ fontFamily: '"Sniglet", cursive' }}
            >
              Press SPACEBAR or CLICK to flap wings
            </motion.p>
            
            {/* Music Controls */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="mt-6"
            >
              <button
                onClick={() => {
                  if (backgroundAudio && audioContext) {
                    if (isMusicPlaying) {
                      backgroundAudio.pause()
                      setIsMusicPlaying(false)
                    } else {
                      backgroundAudio.play()
                      setIsMusicPlaying(true)
                    }
                  }
                }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 shadow-lg"
                style={{ fontFamily: '"Sniglet", cursive' }}
              >
                {isMusicPlaying ? '🔇 Mute Music' : '🎵 Play Music'}
              </button>
              <p className="text-xs text-gray-600 mt-2 opacity-70">
                Music pitch changes with your clicking speed!
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Game Over Screen */}
      {gameState.gameOver && !showNameInput && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-center text-gray-800 bg-white p-8 rounded-lg shadow-2xl border-2 border-gray-200"
            style={{ fontFamily: '"Comic Neue", cursive' }}
          >
            <h2 className="text-4xl font-bold mb-4">Game Over!</h2>
            <p className="text-xl mb-4">Score: {Math.floor(gameState.score / 2)}</p>
            <p className="text-lg mb-4">Global High Score: {Math.floor(gameState.highScore / 2)}</p>
            {hasPlayedBefore && personalBest > 0 && (
              <p className="text-lg mb-6 text-blue-600">Your Personal Best: {Math.floor(personalBest / 2)}</p>
            )}
            
            {/* Show top scores in game over screen */}
            {topScores.length > 0 && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-3">🏆 Top 10 Scores</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {topScores.slice(0, 10).map((score, index) => (
                    <div 
                      key={score._id} 
                      className={`flex justify-between items-center text-sm p-1 rounded ${
                        hasPlayedBefore && score.userIP === userIP ? 'bg-blue-100 border-l-2 border-blue-500' : ''
                      }`}
                    >
                      <span className="font-medium text-gray-700">
                        {index + 1}. {score.name}
                        {hasPlayedBefore && score.userIP === userIP && ' (You)'}
                      </span>
                      <span className="font-bold text-blue-600">{Math.floor(score.score / 2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={initGame}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg text-xl font-bold transition-all duration-300"
                style={{ fontFamily: '"Comic Neue", cursive' }}
              >
                Play Again
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => window.location.href = '/'}
                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-lg text-xl font-bold transition-all duration-300"
                style={{ fontFamily: '"Comic Neue", cursive' }}
              >
                Back to Portfolio
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}



      {/* Top Scores Display */}
      {!gameState.isPlaying && !gameState.gameOver && topScores.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 right-8 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg border border-gray-200 max-w-xs"
          style={{ fontFamily: '"Comic Neue", cursive' }}
        >
          <h3 className="text-lg font-bold text-gray-800 mb-3">🏆 Top 10 Scores</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {topScores.slice(0, 10).map((score, index) => (
              <div 
                key={score._id} 
                className={`flex justify-between items-center text-sm p-1 rounded ${
                  hasPlayedBefore && score.userIP === userIP ? 'bg-blue-100 border-l-2 border-blue-500' : ''
                }`}
              >
                <span className="font-medium text-gray-600">
                  {index + 1}. {score.name}
                  {hasPlayedBefore && score.userIP === userIP && ' (You)'}
                </span>
                <span className="font-bold text-blue-600">{Math.floor(score.score / 2)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Floating Score Display - Always Visible */}
      {gameState.isPlaying && (
        <div className="absolute top-4 left-4 text-white text-2xl font-bold" style={{ 
          fontFamily: '"Fredoka One", cursive',
          textShadow: '3px 3px 0px #000, -3px -3px 0px #000, 3px -3px 0px #000, -3px 3px 0px #000'
        }}>
          <div className="text-yellow-300">Score: {Math.floor(gameState.score / 2)}</div>
          {scoresLoaded && (
            <div className="text-green-300 text-lg">Best: {Math.floor(gameState.highScore / 2)}</div>
          )}
        </div>
      )}

      {/* Game Dashboard Portal */}
      {gameState.isPlaying && (
        <div className="absolute top-4 left-4" style={{ marginTop: '60px' }}>
          {/* Dashboard Toggle Button */}
          <button
            onClick={() => setShowDashboard(prev => !prev)}
            className="mb-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-full shadow-lg transition-all duration-200 flex items-center gap-2"
            style={{ fontFamily: '"Sniglet", cursive' }}
          >
            {showDashboard ? '📊 Hide Stats' : '📊 Show Stats'}
          </button>
          
          {/* Dashboard Content */}
          {showDashboard && (
            <div className="bg-black bg-opacity-80 backdrop-blur-sm border-2 border-blue-400 rounded-lg p-4 shadow-2xl min-w-[200px]">
              <div className="text-white text-lg font-bold" style={{ fontFamily: '"Comic Neue", cursive' }}>
                {/* Header */}
                <div className="text-center mb-3 pb-2 border-b-2 border-blue-400">
                  <h3 className="text-blue-300 text-sm uppercase tracking-wider">Game Dashboard</h3>
                </div>
                
                {/* Stats Grid */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-green-300">Global Best:</span>
                    <span className="text-white font-mono">{scoresLoaded ? Math.floor(gameState.highScore / 2) : '...'}</span>
                  </div>
                  
                  {hasPlayedBefore && personalBest > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-blue-300">Your Best:</span>
                      <span className="text-white font-mono">{Math.floor(personalBest / 2)}</span>
                    </div>
                  )}
                  
                  {hasPlayedBefore && playerRank > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-purple-300">Your Rank:</span>
                      <span className="text-white font-mono">#{playerRank}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-orange-300">Click Speed:</span>
                    <span className="text-white font-mono">{clickSpeed.toFixed(1)}/s</span>
                  </div>
                  
                  {/* Music Status */}
                  {isMusicPlaying && (
                    <div className="flex justify-between items-center">
                      <span className="text-pink-300">Music:</span>
                      <span className="text-white font-mono">
                        {clickSpeed <= 0.5 ? 'Very Low' : 
                         clickSpeed <= 1.0 ? 'Low' : 
                         clickSpeed <= 2.0 ? 'Medium-Low' : 
                         clickSpeed <= 3.0 ? 'Medium-High' : 
                         clickSpeed <= 4.0 ? 'High' : 'Very High'}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Loading State */}
                {!scoresLoaded && (
                  <div className="mt-3 pt-2 border-t border-gray-600 text-center">
                    <div className="text-yellow-400 text-sm">Loading Global Best...</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Debug Info - Hidden by default, can be shown with console commands */}
      {/* To show debug info, run in console: document.querySelector('[data-debug]').style.display = 'block' */}
      <div 
        data-debug 
        className="absolute top-4 right-4 bg-white bg-opacity-90 p-2 rounded text-xs text-gray-600 hidden"
        style={{ display: 'none' }}
      >
        <div>showNameInput: {showNameInput ? 'true' : 'false'}</div>
        <div>gameOver: {gameState.gameOver ? 'true' : 'false'}</div>
        <div>isPlaying: {gameState.isPlaying ? 'true' : 'false'}</div>
        <div>Raw Score: {gameState.score}</div>
        <div>Display Score: {Math.floor(gameState.score / 2)}</div>
        <div>Raw Global High: {gameState.highScore}</div>
        <div>Display Global High: {Math.floor(gameState.highScore / 2)}</div>
        <div>Raw Personal Best: {personalBest}</div>
        <div>Display Personal Best: {Math.floor(personalBest / 2)}</div>
        <div>Player Rank: #{playerRank}</div>
        <div>Click Speed: {clickSpeed.toFixed(1)}/s</div>
        <div>Music Pitch Level: {clickSpeed <= 0.5 ? 'Very Low' : 
                                 clickSpeed <= 1.0 ? 'Low' : 
                                 clickSpeed <= 2.0 ? 'Medium-Low' : 
                                 clickSpeed <= 3.0 ? 'Medium-High' : 
                                 clickSpeed <= 4.0 ? 'High' : 'Very High'}</div>
        <div>Music Playing: {isMusicPlaying ? 'YES' : 'NO'}</div>
        <div>Scores Loaded: {scoresLoaded ? 'YES' : 'NO'}</div>
        <div>IP in MongoDB: {hasPlayedBefore ? 'YES' : 'NO'}</div>
        <div>Player Name: {existingPlayerName || 'none'}</div>
        <div>User IP: {userIP || 'loading...'}</div>
        <div>MongoDB Status: {hasPlayedBefore ? `Found ${existingPlayerName}'s best: ${personalBest}` : 'New player'}</div>
        <button 
          onClick={() => setShowNameInput(true)}
          className="mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded"
        >
          Test Name Input
        </button>
        <button 
          onClick={() => setGameState(prev => ({ ...prev, highScore: 0 }))}
          className="mt-2 px-2 py-1 bg-green-500 text-white text-xs rounded block w-full"
        >
          Reset High Score to 0
        </button>
        <button 
          onClick={() => {
            console.log('🔄 Manually refreshing scores from MongoDB...')
            // Refresh top scores
            fetch('/api/flappyado/scores')
              .then(response => response.json())
              .then(data => {
                if (data.success) {
                  setTopScores(data.scores)
                  if (data.scores.length > 0) {
                    const newGlobalHigh = data.scores[0].score
                    setGameState(prev => ({ ...prev, highScore: newGlobalHigh }))
                    console.log('🏆 Updated global high score to:', newGlobalHigh)
                  }
                }
              })
              .catch(error => console.error('Error refreshing scores:', error))
            
            // Refresh player data
            refreshExistingPlayer()
          }}
          className="mt-2 px-2 py-1 bg-yellow-500 text-white text-xs rounded block w-full"
        >
          Refresh All Scores
        </button>
        <button 
          onClick={() => {
            setHasPlayedBefore(true)
            setExistingPlayerName('Test Player')
          }}
          className="mt-2 px-2 py-1 bg-purple-500 text-white text-xs rounded block w-full"
        >
          Simulate IP in MongoDB
        </button>
        <button 
          onClick={() => {
            setHasPlayedBefore(false)
            setExistingPlayerName('')
          }}
          className="mt-2 px-2 py-1 bg-orange-500 text-white text-xs rounded block w-full"
        >
          Simulate IP NOT in MongoDB
        </button>
        <button 
          onClick={refreshExistingPlayer}
          className="mt-2 px-2 py-1 bg-indigo-500 text-white text-xs rounded block w-full"
        >
          Refresh Player Data
        </button>
        <button 
          onClick={async () => {
            if (userIP) {
              const response = await fetch(`/api/flappyado/scores?ip=${userIP}`)
              const data = await response.json()
              console.log('🔍 Manual MongoDB query for IP:', userIP, 'Result:', data)
              if (data.success && data.scores.length > 0) {
                alert(`MongoDB data for ${userIP}:\nName: ${data.scores[0].name}\nRaw Score: ${data.scores[0].score}\nDisplay Score: ${Math.floor(data.scores[0].score / 2)}`)
              } else {
                alert(`No MongoDB data found for IP: ${userIP}`)
              }
            }
          }}
          className="mt-2 px-2 py-1 bg-yellow-500 text-white text-xs rounded block w-full"
        >
          Query MongoDB for IP
        </button>
        <button 
          onClick={async () => {
            const response = await fetch('/api/flappyado/scores')
            const data = await response.json()
            console.log('🔍 Global top scores from MongoDB:', data)
            if (data.success && data.scores.length > 0) {
              alert(`Global Top Scores:\n1. ${data.scores[0].name}: ${data.scores[0].score}\n2. ${data.scores[1]?.name || 'N/A'}: ${data.scores[1]?.score || 'N/A'}\n3. ${data.scores[2]?.name || 'N/A'}: ${data.scores[2]?.score || 'N/A'}\n\nCurrent Global High: ${gameState.highScore}`)
            } else {
              alert('No global scores found in MongoDB')
            }
          }}
          className="mt-2 px-2 py-1 bg-green-500 text-white text-xs rounded block w-full"
        >
          Show Global Top Scores
        </button>
        <button 
          onClick={async () => {
            console.log('🔄 Force refreshing global high score...')
            const response = await fetch('/api/flappyado/scores')
            const data = await response.json()
            if (data.success && data.scores.length > 0) {
              const newGlobalHigh = data.scores[0].score
              setGameState(prev => ({ ...prev, highScore: newGlobalHigh }))
              setScoresLoaded(true)
              console.log('🏆 Force updated global high score to:', newGlobalHigh)
              alert(`Updated Global High Score to: ${newGlobalHigh}`)
            }
          }}
          className="mt-2 px-2 py-1 bg-red-500 text-white text-xs rounded block w-full"
        >
          Force Update Global High
        </button>
      </div>
    </div>

    {/* Name Input Dialog - Moved completely outside main container */}
    {showNameInput && (
      <div className="fixed inset-0 flex items-center justify-center bg-red-500 bg-opacity-80 z-[9999]">
        <div className="text-center text-gray-800 bg-white p-8 rounded-lg shadow-2xl border-2 border-gray-200 max-w-md w-full mx-4" style={{ fontFamily: '"Comic Neue", cursive' }}>
          <h2 className="text-3xl font-bold mb-4">Welcome New Player! 🎮</h2>
          <p className="text-lg mb-6">Final Score: {Math.floor(gameState.score / 2)}</p>
          <p className="text-sm text-blue-600 mb-4">First time playing? Enter your name to save your score!</p>
          <div className="mb-6">
            <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-2">
              Enter your name to save your score:
            </label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Your name (required)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={20}
              required
            />
          </div>
          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={async () => {
                if (!playerName.trim()) {
                  alert('Please enter your name to save your score!')
                  return
                }
                const saved = await saveHighScore(playerName.trim(), gameState.score)
                if (saved) {
                  setShowNameInput(false)
                  setPlayerName('')
                }
              }}
              disabled={isSavingScore || !playerName.trim()}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg text-lg font-bold transition-all duration-300 disabled:opacity-50"
              style={{ fontFamily: '"Comic Neue", cursive' }}
            >
              {isSavingScore ? 'Saving...' : 'Save Score'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowNameInput(false)
                setPlayerName('')
              }}
              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-lg text-xl font-bold transition-all duration-300"
              style={{ fontFamily: '"Comic Neue", cursive' }}
            >
              Cancel
            </motion.button>
          </div>
        </div>
      </div>
    )}
  </>
  )
}

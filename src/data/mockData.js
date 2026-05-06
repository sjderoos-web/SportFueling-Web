export const TRAINING_TYPES = {
  rest: { label: 'Rest Day', color: 'gray', intensityFactor: 0 },
  easy_run: { label: 'Easy Run', color: 'blue', intensityFactor: 0.4 },
  tempo_run: { label: 'Tempo Run', color: 'orange', intensityFactor: 0.7 },
  long_run: { label: 'Long Run', color: 'red', intensityFactor: 0.9 },
  easy_bike: { label: 'Easy Ride', color: 'blue', intensityFactor: 0.35 },
  long_bike: { label: 'Long Ride', color: 'orange', intensityFactor: 0.85 },
  interval_bike: { label: 'Interval Ride', color: 'red', intensityFactor: 0.8 },
  swim: { label: 'Swim', color: 'cyan', intensityFactor: 0.5 },
  strength: { label: 'Strength', color: 'purple', intensityFactor: 0.45 },
  yoga: { label: 'Yoga / Recovery', color: 'green', intensityFactor: 0.15 },
}

export const SPORT_TYPES = ['Cycling', 'Running', 'Triathlon', 'Swimming', 'Multisport']

export const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const MEALS = {
  breakfast: [
    { name: 'Oatmeal with banana & honey', carbs: 65, protein: 10, fat: 5, kcal: 345 },
    { name: 'Greek yogurt with granola & berries', carbs: 45, protein: 18, fat: 8, kcal: 324 },
    { name: 'Whole grain toast with eggs & avocado', carbs: 30, protein: 20, fat: 18, kcal: 358 },
    { name: 'Rice cakes with peanut butter & banana', carbs: 60, protein: 12, fat: 10, kcal: 378 },
    { name: 'Smoothie bowl with fruit & seeds', carbs: 55, protein: 12, fat: 9, kcal: 349 },
  ],
  pre_workout: [
    { name: 'Banana + energy gel', carbs: 40, protein: 2, fat: 0, kcal: 168 },
    { name: 'Rice cakes with jam', carbs: 45, protein: 3, fat: 1, kcal: 201 },
    { name: 'Date & nut bar', carbs: 35, protein: 5, fat: 6, kcal: 214 },
    { name: 'Applesauce + electrolyte drink', carbs: 30, protein: 0, fat: 0, kcal: 120 },
  ],
  during_workout: [
    { name: 'Energy gels (2x)', carbs: 50, protein: 0, fat: 0, kcal: 200 },
    { name: 'Sports drink (750ml)', carbs: 45, protein: 0, fat: 0, kcal: 180 },
    { name: 'Banana + water', carbs: 27, protein: 1, fat: 0, kcal: 112 },
    { name: 'Rice cakes + sports drink', carbs: 65, protein: 3, fat: 2, kcal: 290 },
  ],
  lunch: [
    { name: 'Pasta with chicken & tomato sauce', carbs: 80, protein: 35, fat: 8, kcal: 536 },
    { name: 'Brown rice bowl with salmon & veggies', carbs: 60, protein: 38, fat: 12, kcal: 492 },
    { name: 'Quinoa salad with chickpeas & feta', carbs: 55, protein: 22, fat: 14, kcal: 434 },
    { name: 'Jacket potato with tuna & salad', carbs: 65, protein: 30, fat: 6, kcal: 434 },
    { name: 'Whole grain wrap with turkey & avocado', carbs: 45, protein: 28, fat: 16, kcal: 436 },
  ],
  snack: [
    { name: 'Cottage cheese with fruit', carbs: 18, protein: 14, fat: 2, kcal: 146 },
    { name: 'Nuts & dried fruit mix', carbs: 22, protein: 6, fat: 14, kcal: 234 },
    { name: 'Protein bar', carbs: 28, protein: 20, fat: 8, kcal: 264 },
    { name: 'Apple with almond butter', carbs: 25, protein: 4, fat: 9, kcal: 193 },
    { name: 'Rice cakes with hummus', carbs: 30, protein: 5, fat: 4, kcal: 176 },
  ],
  dinner: [
    { name: 'Grilled chicken with sweet potato & greens', carbs: 45, protein: 42, fat: 10, kcal: 438 },
    { name: 'Salmon with quinoa & roasted vegetables', carbs: 40, protein: 38, fat: 18, kcal: 474 },
    { name: 'Lean beef stir-fry with noodles', carbs: 60, protein: 35, fat: 12, kcal: 484 },
    { name: 'Lentil & vegetable curry with rice', carbs: 70, protein: 18, fat: 8, kcal: 428 },
    { name: 'Turkey meatballs with whole wheat pasta', carbs: 65, protein: 40, fat: 10, kcal: 506 },
  ],
  post_workout: [
    { name: 'Chocolate milk (500ml)', carbs: 50, protein: 17, fat: 5, kcal: 313 },
    { name: 'Recovery shake with banana', carbs: 55, protein: 25, fat: 3, kcal: 347 },
    { name: 'Greek yogurt with honey & granola', carbs: 48, protein: 18, fat: 6, kcal: 318 },
    { name: 'Egg on toast with orange juice', carbs: 40, protein: 14, fat: 8, kcal: 288 },
  ],
}

export const defaultWeekSchedule = [
  { day: 'Mon', type: 'easy_run', durationMin: 45 },
  { day: 'Tue', type: 'strength', durationMin: 60 },
  { day: 'Wed', type: 'tempo_run', durationMin: 50 },
  { day: 'Thu', type: 'rest', durationMin: 0 },
  { day: 'Fri', type: 'easy_bike', durationMin: 60 },
  { day: 'Sat', type: 'long_bike', durationMin: 180 },
  { day: 'Sun', type: 'yoga', durationMin: 30 },
]

export const weightHistory = [
  { date: '2026-01-06', weight: 84.2 },
  { date: '2026-01-13', weight: 83.8 },
  { date: '2026-01-20', weight: 83.5 },
  { date: '2026-01-27', weight: 83.1 },
  { date: '2026-02-03', weight: 82.9 },
  { date: '2026-02-10', weight: 82.4 },
  { date: '2026-02-17', weight: 82.2 },
  { date: '2026-02-24', weight: 81.8 },
  { date: '2026-03-03', weight: 81.5 },
  { date: '2026-03-10', weight: 81.0 },
  { date: '2026-03-17', weight: 80.8 },
  { date: '2026-03-24', weight: 80.4 },
  { date: '2026-03-31', weight: 80.1 },
  { date: '2026-04-07', weight: 79.8 },
  { date: '2026-04-14', weight: 79.5 },
  { date: '2026-04-21', weight: 79.2 },
  { date: '2026-04-28', weight: 79.0 },
  { date: '2026-05-05', weight: 78.8 },
]

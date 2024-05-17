type MealItem = {
  name: string
  description: string | null
  quantity: number
  unit: string
}

export type Meal = {
  title: string
  items: MealItem[]
  completed: Date | null
}

export type Diet = {
  id: string
  title: string
  meals: Meal[]
  author_id: string
  author_name: string
}

export type User = {
  id: string
  name: string
  email: string
  password_hash: string
  crn: string | null
  image_url: string | null
  diet: Diet | null
  days_in_offensive: number
}
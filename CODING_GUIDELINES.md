# Mandi Marketplace Coding Guidelines

This document outlines the coding standards and best practices for the Mandi Marketplace project. Following these guidelines ensures consistency across the codebase and improves maintainability.

## General Guidelines

### Code Formatting
- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons at the end of statements
- Maximum line length: 100 characters
- Use trailing commas in multiline object literals and arrays
- Keep lines short and focused on one task

### Naming Conventions
- **Components**: PascalCase (e.g., `ProductCard`, `MarketPriceChart`)
- **Functions**: camelCase (e.g., `getProducts`, `handleSubmit`)
- **Constants**: UPPER_CASE (e.g., `MAX_PRICE`, `DEFAULT_UNIT`)
- **Variables**: camelCase (e.g., `productData`, `userInfo`)
- **Files**:
  - Components: PascalCase (e.g., `ProductCard.tsx`)
  - Utilities: camelCase (e.g., `formatCurrency.ts`)
  - Pages: camelCase (e.g., `page.tsx`, `layout.tsx`)

### File Structure
- Group related files in appropriate directories
- Keep component files relatively small and focused
- Split large components into smaller, reusable parts
- Use barrel exports (`index.ts`) for clean imports

## React & Next.js Guidelines

### Component Structure
```tsx
// 1. Imports (grouped and sorted)
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ExternalComponent } from 'external-library'

import { MyComponent } from '@/components/ui/MyComponent'
import { useMyHook } from '@/hooks/useMyHook'
import { myUtility } from '@/lib/utilities'

// 2. Type definitions
interface Props {
  property: string
  optionalProperty?: number
}

// 3. Component function
export function MyComponent({ property, optionalProperty = 0 }: Props) {
  // State and hooks at the top
  const [state, setState] = useState(initialState)
  const router = useRouter()
  
  // Effects next
  useEffect(() => {
    // effect logic
  }, [dependencies])
  
  // Event handlers
  const handleEvent = () => {
    // logic
  }
  
  // Helper functions within the component
  const helperFunction = () => {
    // logic
  }
  
  // Return JSX
  return (
    <div>
      {/* JSX content */}
    </div>
  )
}
```

### React Best Practices
- Use functional components with hooks
- Avoid class components unless necessary
- Keep components pure when possible
- Use proper dependency arrays in `useEffect`
- Avoid inline function definitions in JSX where performance matters
- Use fragments (`<>...</>`) to avoid unnecessary div wrappers
- Prefer controlled components over uncontrolled ones

### Next.js Specific
- Follow the App Router pattern and conventions
- Use server components where possible
- Place client-side code in components with "use client" directive
- Utilize Next.js Image component for optimized images
- Use proper data fetching patterns based on requirements

## TypeScript Guidelines

### Type Safety
- Enable strict TypeScript checking
- Avoid using `any` type when possible
- Use proper interfaces and types for all data structures
- Prefer interfaces for object shapes that will be extended
- Use type aliases for unions, primitives, and complex types
- Always type function parameters and return values

### Example
```tsx
// Good
interface User {
  id: string
  name: string
  email?: string
}

function getUserName(user: User): string {
  return user.name
}

// Avoid
function getUserName(user: any): any {
  return user.name
}
```

## Supabase Guidelines

### Database Queries
- Always handle errors in Supabase queries
- Use proper type definitions for database entities
- Implement graceful fallbacks for failures
- Structure query code for readability

### Example
```typescript
// Good
async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
    
    if (error) {
      console.error('Error fetching products:', error)
      return getMockProducts() // Fallback
    }
    
    return data || []
  } catch (error) {
    console.error('Exception in getProducts:', error)
    return getMockProducts() // Fallback
  }
}

// Avoid
async function getProducts() {
  const { data } = await supabase.from('products').select('*')
  return data
}
```

### Storage
- Use consistent bucket naming (kebab-case)
- Generate unique filenames to prevent collisions
- Validate file sizes and types before upload
- Handle image processing appropriately

## State Management

### Component State
- Use `useState` for simple component-level state
- Use `useReducer` for complex state logic
- Keep related state together

### Application State
- Use React Context for shared state when appropriate
- Consider more robust state management like Redux for complex apps
- Be consistent with your chosen approach

## Error Handling

### Client-Side
- Use try/catch blocks around async operations
- Display user-friendly error messages
- Log detailed errors for debugging
- Implement fallbacks for failed operations

### Server-Side
- Properly handle and log server-side errors
- Return appropriate HTTP status codes
- Provide meaningful error messages to clients

## Performance Considerations

### Optimization
- Memoize expensive calculations with `useMemo`
- Optimize re-renders with `React.memo` and `useCallback`
- Lazy load components and routes when appropriate
- Use proper keys in lists to optimize rendering
- Implement pagination for large datasets

### Image Optimization
- Use appropriate image formats (WebP when possible)
- Optimize images before upload
- Utilize Next.js Image component with proper sizes
- Consider responsive images for different viewports

## Testing Guidelines

### Component Testing
- Write tests for all components
- Focus on user behavior rather than implementation details
- Use React Testing Library for component tests
- Mock external dependencies appropriately

### API Testing
- Test all API endpoints
- Cover both success and error cases
- Use proper mocking for external services

## Accessibility Guidelines

- Use semantic HTML elements
- Include proper ARIA attributes when needed
- Ensure proper keyboard navigation
- Maintain sufficient color contrast
- Support screen readers with appropriate text alternatives

## Documentation

- Document complex functions and components
- Keep README files updated
- Add inline comments for complex logic
- Document APIs clearly

## Git Practices

- Write clear, concise commit messages
- Use feature branches for new development
- Keep commits focused and logical
- Follow conventional commit format when possible

## Review these guidelines regularly and update as needed. 
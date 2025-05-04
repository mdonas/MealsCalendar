# Generador de Menú Quincenal (Bi-weekly Menu Generator)

A web application that generates a two-week meal plan without repeating ingredients on the same day.

## Description

This application allows users to upload a JSON file with recipe data and automatically generates a 14-day meal plan, ensuring that ingredients are not repeated within the same day. The app is designed to help with meal planning and preparation, providing a convenient way to organize your bi-weekly meals.

## Features

- **Dynamic Meal Plan Generation**: Automatically creates a balanced 14-day menu
- **No Same-Day Ingredient Repetition**: Ensures ingredients are not repeated in the same day's meals
- **No Same-Day Type Repetition**: Ensures don't eat meat or fish at dinner if you eat it at lunch
- **No Same Meal**: Ensures you eat the same meal at least 2 days apart
- **Recipe JSON Upload**: Load your custom recipes from a JSON file
- **Recipe Details View**: Click on any meal to see detailed ingredients and preparation steps
- **Editable Plan**: Modify any day's meal plan by choosing from available recipes
- **PDF Export**: Export your meal plan to PDF for printing or sharing
- **Responsive Design**: Works on desktop and mobile devices

## Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Bootstrap 5.3.0
- Bootstrap Icons 1.11.1
- jsPDF (For PDF export)
- html2canvas (For PDF export)

## How to Use

1. Open the application in your web browser
2. Click on the upload area or drag and drop your JSON recipe file
   - The JSON file must follow the structure shown in the example `recetas.json`
3. Click "Generate Menu" to create your bi-weekly meal plan
4. View recipe details by clicking on any meal
5. Edit a day's meals by clicking the edit icon
6. Export your completed meal plan to PDF using the "Export to PDF" button
7. Use the "Start Over" button to begin the process again

## File Structure

```
project/
├── index.html         # Main HTML file
├── style.css          # CSS styles
├── script.js          # JavaScript functionality
├── recetas.json       # Example recipe data
└── README.md          # This file
```

## JSON Structure

Your recipe JSON file should follow this structure:

```json
{
  "comidas": [         // Lunch recipes
    {
      "titulo": "Recipe Title",
      "ingredientes": [
        {
          "ingrediente": "Ingredient Name",
          "cantidad": "Amount"
        }
      ],
      "pasos": ["Step 1", "Step 2"],
      "tiene_carne": true,
      "tiene_pescado": false
    }
  ],
  "cenas": [           // Dinner recipes
    {
      // Same structure as comidas
    }
  ]
}
```

## Setup Instructions

1. Clone or download this repository
2. No build steps required - this is a static web application
3. Open `index.html` in your web browser
4. Alternatively, host the files on any static web server

## Browser Compatibility

- Chrome (Recommended)
- Firefox
- Edge
- Safari

## License

This project is available for personal and educational use.

## Credits

Created by Marcos


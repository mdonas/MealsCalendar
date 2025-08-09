# Generador de Menú Quincenal (Bi-weekly Menu Generator)

A web application that generates a two-week meal plan without repeating ingredients on the same day.

## Description

This application is an intelligent meal planning tool that generates optimized 14-day meal plans from your custom recipe collection. It uses smart algorithms to ensure balanced nutrition distribution while avoiding ingredient conflicts and meal repetition. The app features a modern, responsive interface with drag-and-drop file upload, interactive meal editing, and professional PDF export capabilities.

## Features

- **Dynamic Meal Plan Generation**: Automatically creates a balanced 14-day menu
- **Smart Ingredient Management**: Ensures ingredients are not repeated in the same day's meals
- **Protein Type Control**: Prevents eating meat or fish at dinner if already consumed at lunch
- **Meal Spacing**: Ensures you don't eat the same meal within 2 days
- **Recipe JSON Upload**: Load your custom recipes from a JSON file with drag & drop support
- **Recipe Details View**: Click on any meal to see detailed ingredients and preparation steps
- **Editable Plan**: Modify any day's meal plan by choosing from available recipes through an intuitive modal interface
- **PDF Export**: Export your meal plan to PDF for printing or sharing
- **Local Storage Cache**: Automatically saves uploaded recipes for quick access
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Error Handling**: Comprehensive error messages for invalid file formats or missing data

## Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Bootstrap 5.3.0
- Bootstrap Icons 1.11.1
- jsPDF (For PDF export)
- html2canvas (For PDF export)

## How to Use

1. **Load Recipes**: Open the application in your web browser
2. **Upload File**: Click on the upload area or drag and drop your JSON recipe file
   - The JSON file must follow the structure shown in the example `recetas.json`
   - Files are automatically cached in browser storage for quick access
3. **Generate Menu**: Click "Generate Menu" to create your bi-weekly meal plan
4. **View Details**: Click on any meal title to see detailed ingredients and preparation steps
5. **Edit Days**: Click the pencil icon on any day to modify the meal selection
6. **Export PDF**: Use the "Export to PDF" button to download your completed meal plan
7. **Start Over**: Use the "Start Over" button to clear the current plan and begin again

## Algorithm Logic

The meal plan generator uses intelligent algorithms to ensure:

- No ingredient repetition within the same day (lunch and dinner)
- No protein type conflicts (meat/fish) between lunch and dinner on the same day
- Minimum 2-day spacing between identical meals
- Balanced distribution of meat and fish meals throughout the week

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
  "comidas": [
    // Lunch recipes
    {
      "titulo": "Recipe Title",
      "ingredientes": [
        {
          "ingrediente": "Ingredient Name",
          "cantidad": "Amount"
        }
      ],
      "pasos": ["Step 1", "Step 2", "Step 3"],
      "tiene_carne": true,
      "tiene_pescado": false,
      "macros": [
        // Nutritional information (optional)
        {
          "titulo": "Calorías",
          "cantidad": "810"
        },
        {
          "titulo": "Carbohidratos",
          "cantidad": "70"
        },
        {
          "titulo": "Proteínas",
          "cantidad": "74"
        },
        {
          "titulo": "Grasas",
          "cantidad": "16"
        }
      ]
    }
  ],
  "cenas": [
    // Dinner recipes (same structure as comidas)
    {
      // Same structure as lunch recipes
    }
  ]
}
```

### Required Fields

- `titulo`: Recipe title/name
- `ingredientes`: Array of ingredient objects with `ingrediente` and `cantidad`
- `pasos`: Array of cooking steps as strings
- `tiene_carne`: Boolean indicating if recipe contains meat
- `tiene_pescado`: Boolean indicating if recipe contains fish

### Optional Fields

- `macros`: Array of nutritional information objects with `titulo` and `cantidad`

## File Structure

```
project/
├── index.html         # Main HTML file with responsive layout
├── style.css          # CSS styles with custom themes
├── script.js          # JavaScript functionality (610 lines)
├── recetas.json       # Example recipe data with 14 recipes
└── README.md          # Project documentation
```

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla ES6+)
- **UI Framework**: Bootstrap 5.3.0
- **Icons**: Bootstrap Icons 1.11.1
- **PDF Generation**: jsPDF 2.5.1
- **Canvas Rendering**: html2canvas 1.4.1
- **Storage**: Browser LocalStorage for caching
- **Responsive Design**: Mobile-first approach with Bootstrap grid system

## Browser Compatibility

- ✅ Chrome (Recommended)
- ✅ Firefox
- ✅ Edge
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Features

- **Local Caching**: Uploaded recipes are stored in browser cache
- **Lazy Loading**: Recipe details loaded on demand
- **Optimized PDF Generation**: Efficient rendering for large meal plans
- **Responsive Images**: Scalable icons and UI elements

## Current Limitations

- Nutritional macro information is available in recipe data but not yet displayed in the UI
- PDF export does not include macro information (feature commented out in code)
- Single language support (Spanish)

## Example Data

The included `recetas.json` file contains:

- **7 lunch recipes** (comidas): Various combinations of meat, fish, and vegetables
- **7 dinner recipes** (cenas): Balanced evening meals with different protein sources
- **Complete nutritional data**: Each recipe includes calories, carbohydrates, proteins, and fats
- **Diverse ingredients**: Covering meat, fish, vegetables, grains, and dairy products
- **Cooking variety**: Recipes include grilling, baking, sautéing, and other cooking methods

## Future Enhancements

- Display nutritional macros in recipe details and PDF exports
- Multi-language support
- Recipe filtering by dietary preferences
- Shopping list generation from selected menu
- Recipe rating and favorites system

## License

This project is available for personal and educational use.

## Credits

Created by Marcos

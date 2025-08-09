document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('recipe-file');
    const fileInfo = document.getElementById('file-info');
    const fileName = document.getElementById('file-name');
    const generateBtn = document.getElementById('generate-btn');
    const generateBtnText = document.getElementById('generate-btn-text');
    const loadingSpinner = document.getElementById('loading-spinner');
    const startOverBtn = document.getElementById('start-over-btn');
    const menuContainer = document.getElementById('menu-container');
    const calendarGrid = document.getElementById('calendar-grid');
    const errorContainer = document.getElementById('error-container');
    const errorMessage = document.getElementById('error-message');
    const recipeModalEl = document.getElementById('recipeModal');
    const recipeModal = new bootstrap.Modal(recipeModalEl);
    const recipeModalLabel = recipeModalEl.querySelector('.modal-title');
    const recipeModalBody = recipeModalEl.querySelector('.modal-body');
    const exportPdfContainer = document.getElementById('export-pdf-container');
    const exportPdfBtn = document.getElementById('export-pdf-btn');
    const exportSpinner = document.getElementById('export-spinner');
    const exportStatus = document.getElementById('export-status');
    const pdfPreviewContainer = document.getElementById('pdf-preview-container');
    const pdfContent = document.getElementById('pdf-content');
    const jsonExampleContainer = document.getElementById('json-example-container');

    // State
    let recipes = null;
    let menuData = null;
    let pdfBlob = null;
    let pdfFilename = 'menu-quincenal.pdf';

    // Check LocalStorage for cached recipes
    const cachedRecipes = localStorage.getItem('cachedRecipes');
    if (cachedRecipes) {
        try {
            recipes = JSON.parse(cachedRecipes);
            fileName.textContent = 'Recetas cargadas desde caché';
            fileInfo.classList.remove('hidden');
            generateBtn.disabled = false;
        } catch (e) {
            localStorage.removeItem('cachedRecipes');
        }
    }

    // Event Listeners
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#28a745';
        uploadArea.style.backgroundColor = '#333';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#555';
        uploadArea.style.backgroundColor = '#2a2a2a';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#555';
        uploadArea.style.backgroundColor = '#2a2a2a';

        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
            handleFile(fileInput.files[0]);
        }
    });

    generateBtn.addEventListener('click', generateMenu);

    startOverBtn.addEventListener('click', () => {
        // Reset UI state
        menuContainer.classList.add('hidden');
        startOverBtn.classList.add('hidden');
        errorContainer.classList.add('hidden');
        fileInfo.classList.add('hidden');
        exportPdfContainer.classList.add('hidden');
        pdfPreviewContainer.classList.add('hidden');
        jsonExampleContainer.classList.remove('hidden');
        generateBtn.disabled = true;
        fileInput.value = '';
        recipes = null;
        menuData = null;
        pdfBlob = null;
        exportPdfBtn.disabled = true;
        exportStatus.textContent = '';
    });

    exportPdfBtn.addEventListener('click', exportToPdf);
    //Dicionario de normalizacion
    const normalizacionIngredientes = {
        "arroz blanco": "arroz",
        "arroz integral": "arroz",
    };
    // Functions
    function normalizarIngrediente(listadoIngredientes) {
        let resultado = new Set();
        for (let nombre of listadoIngredientes) {
            const nombreLower = nombre.toLowerCase();
            let añadido = false;

            for (const [variante, estandar] of Object.entries(normalizacionIngredientes)) {
                if (nombreLower === variante.toLowerCase()) {
                    resultado.add(estandar);
                    añadido = true;
                    break; // 💡 Ya está normalizado, salimos
                } else if (nombreLower.includes(variante.toLowerCase())) {
                    resultado.add(estandar);
                    añadido = true;
                    break; // 💡 Ya está normalizado, salimos
                }
            }

            if (!añadido) {
                resultado.add(nombreLower); // 💡 Si no se normalizó, se añade tal cual
            }
        }
        return resultado
    }
    function handleFile(file) {
        if (!file.type.includes('json')) {
            showError('El archivo debe ser de tipo JSON');
            return;
        }

        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);

                // New validation: object must have both comidas and cenas arrays
                if (
                    !data ||
                    !Array.isArray(data.comidas) ||
                    !Array.isArray(data.cenas)
                ) {
                    showError("El archivo JSON debe tener las claves 'comidas' y 'cenas'.");
                    return;
                }

                // (Optional) lighter validation per recipe—just check it has at least a title
                const validComidas = data.comidas.every(r => r.titulo);
                const validCenas = data.cenas.every(r => r.titulo);
                if (!validComidas || !validCenas) {
                    showError("Cada receta debe tener al menos un 'titulo'.");
                    return;
                }

                // Assign validated structure
                recipes = {
                    comidas: data.comidas,
                    cenas: data.cenas
                };

                // Cache valid recipes
                localStorage.setItem('cachedRecipes', JSON.stringify(recipes));

                // Update UI
                fileName.textContent = file.name;
                fileInfo.classList.remove('hidden');
                generateBtn.disabled = false;
                errorContainer.classList.add('hidden');
                jsonExampleContainer.classList.add('hidden');

            } catch (e) {
                showError('El archivo JSON no es válido');
            }
        };

        reader.readAsText(file);
    }

    function showError(message) {
        // If a generic error, use our friendly tone
        errorMessage.textContent = message.includes('intentos')
            ? message
            : '¡Vaya! Algo salió mal cargando tu archivo. ¿Lo intentamos otra vez?';
        errorContainer.classList.remove('hidden');
        recipes = null;
        generateBtn.disabled = true;
    }

    function generateMenu() {
        // Show loading state
        generateBtn.disabled = true;
        loadingSpinner.classList.remove('hidden');
        generateBtnText.textContent = 'Generando...';

        // Clear previous menu
        calendarGrid.innerHTML = '';

        // Simulate menu generation (would be replaced with actual algorithm)
        setTimeout(() => {
            menuData = generateMenuData(recipes);
            renderMenu(menuData);

            // Show menu and reset UI
            menuContainer.classList.remove('hidden');
            startOverBtn.classList.remove('hidden');
            exportPdfContainer.classList.remove('hidden');
            jsonExampleContainer.classList.add('hidden');
            generateBtn.disabled = false;
            loadingSpinner.classList.add('hidden');
            generateBtnText.textContent = 'Generar Menú';

            // Auto-trigger PDF export
            //exportToPdf();

            // Show error alert if any days failed to generate
            const hasErrors = menuData.some(day => day.error);
            if (hasErrors) {
                errorMessage.textContent = 'No se pudo generar el menú completo. Hay días con errores.';
                errorContainer.classList.remove('hidden');
            } else {
                errorContainer.classList.add('hidden');
            }
        }, 1500);
    }

    function generateMenuData(recipes) {
        const days = [];
        const weekdays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

        for (let i = 0; i < 14; i++) {
            const dayNumber = i + 1;
            const weekNumber = Math.floor(i / 7) + 1;
            const weekdayIndex = i % 7;
            let attempt = 0;
            let found = false;

            while (attempt < 50 && !found) {
                attempt++;
                // select candidates
                const lunchIdx = Math.floor(Math.random() * recipes.comidas.length);
                const dinnerIdx = Math.floor(Math.random() * recipes.cenas.length);
                const lunch = recipes.comidas[lunchIdx];
                const dinner = recipes.cenas[dinnerIdx];

                // a) no shared ingredients
                let lunchIngsNames = new Set(lunch.ingredientes.map(x => x.ingrediente));
                lunchIngsNames = normalizarIngrediente(lunchIngsNames)
                let dinnerIngsNames = new Set(dinner.ingredientes.map(x => x.ingrediente));

                const shared = [...lunchIngsNames].some(ing => dinnerIngsNames.has(ing));
                if (shared.length > 1 || (shared.length === 1 && shared[0].toLowerCase() !== "tomate")) continue;

                // b) not used in same slot last two days
                const prevLunches = days.slice(-2).map(d => d.lunch).filter(Boolean);
                const prevDinners = days.slice(-2).map(d => d.dinner).filter(Boolean);
                if (prevLunches.includes(lunch.titulo) || prevDinners.includes(dinner.titulo)) {
                    continue;
                }
                if ((lunch.tiene_carne && dinner.tiene_carne) || (lunch.tiene_pescado && dinner.tiene_pescado)) {
                    continue;
                }
                // if ok, push and mark found
                days.push({
                    day: dayNumber,
                    weekday: weekdays[weekdayIndex],
                    week: weekNumber,
                    lunch: lunch.titulo,
                    lunchObj: lunch,
                    dinner: dinner.titulo,
                    dinnerObj: dinner
                });
                found = true;
            }

            if (!found) {
                // assign error for this day
                days.push({
                    day: dayNumber,
                    weekday: weekdays[weekdayIndex],
                    week: weekNumber,
                    error: 'No se pudo generar una combinación válida para este día.'
                });
            }
        }

        return days;
    }

    function renderMenu(menuData) {
        menuData.forEach((day, dayIndex) => {
            const dayCard = document.createElement('div');
            dayCard.className = 'day-card card h-100 position-relative'; // make room for edit icon

            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-header';
            dayHeader.textContent = `${day.weekday} (Día ${day.day})`;

            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';

            if (day.error) {
                const errorSection = document.createElement('div');
                errorSection.className = 'error-section meal-section';
                errorSection.innerHTML = `<i class="bi bi-exclamation-triangle me-2"></i>${day.error}`;
                cardBody.appendChild(errorSection);
            } else {
                ['lunch', 'dinner'].forEach(mealType => {
                    const section = document.createElement('div');
                    section.className = (mealType === 'lunch' ? 'lunch-section' : 'dinner-section') + ' meal-section';

                    // Title
                    const recipeTitle = document.createElement('p');
                    recipeTitle.className = 'meal-title clickable';
                    recipeTitle.innerHTML = `
                    <i class="bi ${mealType === 'lunch' ? 'bi-sun' : 'bi-moon'} me-2"></i>
                    <span class="label-badge">${mealType === 'lunch' ? 'Comida' : 'Cena'}</span><br/>
                    <span>${day[mealType]}</span>
                    `;

                    // Open details in modal
                    recipeTitle.addEventListener('click', () => {
                        const source = mealType === 'lunch' ? recipes.comidas : recipes.cenas;
                        const recipe = source.find(r => r.titulo === day[mealType]);
                        if (!recipe) return;
                        recipeModalLabel.textContent = recipe.titulo;
                        recipeModalBody.innerHTML = `
                        <h5>Ingredientes</h5>
                        <ul>
                            ${recipe.ingredientes.map(i => `<li>${i.ingrediente} – ${i.cantidad}</li>`).join('')}
                        </ul>
                        <h5>Pasos</h5>
                        <ol>
                            ${recipe.pasos.map(p => `<li>${p}</li>`).join('')}
                        </ol>
                        `;
                        recipeModal.show();
                    });

                    section.appendChild(recipeTitle);
                    // no inline detailPanel anymore
                    cardBody.appendChild(section);
                });
            }

            // Add edit button (pencil icon) to top-right
            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-sm btn-secondary btn-pencil';
            editBtn.style.top = '8px';    /* move it just below the extra header padding */
            editBtn.style.right = '8px';
            editBtn.innerHTML = '<i class="bi bi-pencil"></i>';
            editBtn.addEventListener('click', () => openEditModal(dayIndex));
            dayCard.appendChild(editBtn);

            dayCard.appendChild(dayHeader);
            dayCard.appendChild(cardBody);
            calendarGrid.appendChild(dayCard);
        });
    }
    // Export to PDF functionality<
    function exportToPdf() {
        if (!menuData) return;

        // Show loading state
        exportPdfBtn.disabled = true;
        exportSpinner.classList.remove('hidden');
        exportStatus.textContent = 'Generando PDF...';

        generatePdfFile();

        // Re-enable button and show download link
        exportPdfBtn.disabled = false;
        exportSpinner.classList.add('hidden');
        exportStatus.textContent = 'PDF generado con éxito';
    }

    function generatePdfFile() {
        // This would be replaced with an actual API call in production
        // For now, we'll just create a PDF file using jsPDF

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');

        // Pagination setup: 2 days per page
        const daysPerPage = 2;
        let dayCount = 0;
        let posY = 10;      // vertical cursor on current page

        // Add title
        doc.setFontSize(18);
        doc.text('Menú Quincenal', 105, posY, { align: 'center' });
        posY += 10;

        // Loop through validated days
        menuData.forEach((day) => {
            if (day.error) return; // skip error days

            // If we've already placed 2 days on this page, start a new one
            if (dayCount > 0 && dayCount % daysPerPage === 0) {
                doc.addPage();
                posY = 10;
            }

            dayCount++;

            // Day header
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text(`${day.weekday} (Día ${day.day})`, 10, posY);
            posY += 8;

            // Lunch section
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text(`Comida: ${day.lunch}`, 10, posY);
            posY += 7;

            // ---- INGREDIENTS (bold) ----
            doc.setFontSize(10);
            doc.setFont(undefined, 'bold');
            doc.text(`Ingredientes:`, 15, posY);
            posY += 5;

            // List ingredients
            doc.setFont(undefined, 'normal');
            day.lunchObj.ingredientes.forEach(ing => {
                doc.text(`• ${ing.ingrediente} - ${ing.cantidad}`, 20, posY);
                posY += 5;
            });

            // ---- PREPARACIÓN ----
            if (day.lunchObj.pasos.length != 0) {
                console.log(day.lunchObj.pasos)
                doc.setFont(undefined, 'bold');
                doc.text(`Preparación:`, 15, posY);
                posY += 5;
                doc.setFont(undefined, 'normal');
                day.lunchObj.pasos.forEach(step => {
                    doc.text(`- ${step}`, 5, posY);
                    posY += 5;
                });
            }


            // ---- MACROS ----
            // doc.setFontSize(10);
            // doc.setFont(undefined, 'bold');
            // doc.text(`Macros:`, 15, posY);
            // posY += 5;

            // doc.setFont(undefined, 'normal');
            // let text1 = "";
            // day.lunchObj.macros.forEach(mac => {
            //     text1 += `${mac.titulo} = ${mac.cantidad};  `;
            // });
            // doc.text(text1, 20, posY)
            // posY += 5;

            // Dinner section
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text(`Cena: ${day.dinner}`, 10, posY);
            posY += 7;

            // ---- INGREDIENTS ----
            doc.setFontSize(10);
            doc.setFont(undefined, 'bold');
            doc.text(`Ingredientes:`, 15, posY);
            posY += 5;

            doc.setFont(undefined, 'normal');
            day.dinnerObj.ingredientes.forEach(ing => {
                doc.text(`• ${ing.ingrediente} - ${ing.cantidad}`, 20, posY);
                posY += 5;
            });

            // ---- PREPARACIÓN ----
            if (day.dinnerObj.pasos.length != 0) {
                doc.setFont(undefined, 'bold');
                doc.text(`Preparación:`, 15, posY);
                posY += 5;
                doc.setFont(undefined, 'normal');
                day.dinnerObj.pasos.forEach(step => {
                    doc.text(`- ${step}`, 5, posY);
                    posY += 5;
                });
            }


            // // ---- MACROS ----
            // doc.setFontSize(10);
            // doc.setFont(undefined, 'bold');
            // doc.text(`Macros:`, 15, posY);
            // posY += 5;

            // doc.setFont(undefined, 'normal');
            // let text = "";
            // day.dinnerObj.macros.forEach(mac => {
            //     text += `${mac.titulo} = ${mac.cantidad};  `;
            // });
            // doc.text(text, 20, posY);

            // extra spacing to separate days
            posY += 10;
        });

        // Save PDF as blob
        pdfBlob = doc.output('blob');

        // Create download link
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = pdfUrl;
        downloadLink.download = pdfFilename;
        downloadLink.className = 'btn btn-sm btn-success mt-2';
        downloadLink.innerHTML = '<i class="bi bi-download me-2"></i>Descargar PDF';

        // Add download link to export status
        exportStatus.innerHTML = 'PDF generado con éxito! ';
        exportStatus.appendChild(downloadLink);

        // Auto download
        downloadLink.click();
    }

    // State: track current day being edited
    let currentEditIndex = null;
    const editDayModalEl = document.getElementById('editDayModal');
    const editDayModal = new bootstrap.Modal(editDayModalEl);
    const comidaSelect = document.getElementById('edit-comida-select');
    const cenaSelect = document.getElementById('edit-cena-select');
    const saveEditBtn = document.getElementById('save-edit-btn');

    function openEditModal(dayIndex) {
        currentEditIndex = dayIndex;
        // Populate dropdowns with all recipes
        comidaSelect.innerHTML = recipes.comidas
            .map(r => `<option value="${r.titulo}">${r.titulo}</option>`).join('');
        cenaSelect.innerHTML = recipes.cenas
            .map(r => `<option value="${r.titulo}">${r.titulo}</option>`).join('');
        // Pre-select current values
        const dayCardData = calendarGrid.children[dayIndex];
        // extract titles from DOM (or store menuData globally if preferred)
        const currentTitleElems = dayCardData.querySelectorAll('.label-badge + br + span');
        if (currentTitleElems.length === 2) {
            comidaSelect.value = currentTitleElems[0].textContent;
            cenaSelect.value = currentTitleElems[1].textContent;
        }
        editDayModal.show();
    }

    saveEditBtn.addEventListener('click', () => {
        const newComida = comidaSelect.value;
        const newCena = cenaSelect.value;
        if (currentEditIndex == null) return;

        // Update the DOM for that day cell
        const dayCardData = calendarGrid.children[currentEditIndex];
        const mealSections = dayCardData.querySelectorAll('.meal-section');
        // lunch section
        mealSections[0].querySelector('span:last-child').textContent = newComida;
        // dinner section
        mealSections[1].querySelector('span:last-child').textContent = newCena;

        // Update menuData for PDF export
        if (menuData && menuData[currentEditIndex]) {
            const comidaObj = recipes.comidas.find(r => r.titulo === newComida);
            const cenaObj = recipes.cenas.find(r => r.titulo === newCena);

            if (comidaObj) {
                menuData[currentEditIndex].lunch = newComida;
                menuData[currentEditIndex].lunchObj = comidaObj;
            }

            if (cenaObj) {
                menuData[currentEditIndex].dinner = newCena;
                menuData[currentEditIndex].dinnerObj = cenaObj;
            }
        }

        editDayModal.hide();

        // Re-bind click handlers so modal shows updated details
        ['comida', 'cena'].forEach((type, idx) => {
            const mealType = type === 'comida' ? 'lunch' : 'dinner';
            const clickable = mealSections[idx].querySelector('.meal-title.clickable');
            // remove any old listener by cloning
            const clone = clickable.cloneNode(true);
            clickable.parentNode.replaceChild(clone, clickable);
            // attach fresh listener
            clone.addEventListener('click', () => {
                const source = mealType === 'lunch' ? recipes.comidas : recipes.cenas;
                const title = clone.querySelector('span:last-child').textContent;
                const recipe = source.find(r => r.titulo === title);
                if (!recipe) return;
                recipeModalLabel.textContent = recipe.titulo;
                recipeModalBody.innerHTML = `
                <h5>Ingredientes</h5>
                <ul>${recipe.ingredientes.map(i => `<li>${i.ingrediente} – ${i.cantidad}</li>`).join('')}</ul>
                <h5>Pasos</h5>
                <ol>${recipe.pasos.map(p => `<li>${p}</li>`).join('')}</ol>
                `;
                recipeModal.show();
            });
        });

        // Reset PDF export button to generate a new PDF
        exportPdfBtn.disabled = false;
        exportStatus.textContent = 'Menú actualizado. Haz clic para generar un nuevo PDF.';
    });
});
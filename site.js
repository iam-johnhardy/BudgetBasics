function initializeNavigation(){
    const menuButton = document.querySelector(".menu-toggle");
    const navigation = document.getElementById("site-navigation");
    if(!menuButton || !navigation){
        return;
    }

    menuButton.addEventListener("click",function(){
        const isOpen = navigation.classList.toggle("is-open");
        menuButton.classList.toggle("is-open",isOpen);
        menuButton.setAttribute("aria-expanded",String(isOpen));
        menuButton.setAttribute("aria-label",isOpen ? "Close navigation" : "Open navigation");
    });

    navigation.querySelectorAll("a").forEach(function(link){
        link.addEventListener("click",function(){
            navigation.classList.remove("is-open");
            menuButton.classList.remove("is-open");
            navigation.querySelectorAll("details[open]").forEach(function(item){
                item.removeAttribute("open");
            });
            menuButton.setAttribute("aria-expanded","false");
            menuButton.setAttribute("aria-label","Open navigation");
        });
    });
}

function formatNaira(amount){
    return "₦" + amount.toLocaleString("en-NG",{maximumFractionDigits:2});
}

function initializeSavingsCalculator(){
    const form = document.getElementById("savings-form");
    if(!form){
        return;
    }

    form.addEventListener("submit",function(event){
        event.preventDefault();
        const goalName = document.getElementById("goal-name").value.trim() || "Savings goal";
        const target = Number(document.getElementById("target-amount").value);
        const current = Number(document.getElementById("current-savings").value);
        const contribution = Number(document.getElementById("monthly-contribution").value);
        const error = document.getElementById("savings-error");

        if(target <= 0 || current < 0 || contribution < 0 || !Number.isFinite(target + current + contribution)){
            error.textContent = "Enter a target above zero and valid non-negative amounts.";
            return;
        }
        if(current < target && contribution === 0){
            error.textContent = "Add a monthly contribution to estimate your timeline.";
            return;
        }

        error.textContent = "";
        const remaining = Math.max(0,target - current);
        const months = remaining === 0 ? 0 : Math.ceil(remaining / contribution);
        const progress = document.getElementById("savings-progress");
        progress.style.width = Math.min(100,(current / target) * 100) + "%";
        document.querySelector("#savings-result h2").textContent = goalName;
        document.getElementById("savings-summary").textContent = remaining === 0
            ? "You have reached your goal of " + formatNaira(target) + "."
            : formatNaira(current) + " saved of " + formatNaira(target) + ". At " + formatNaira(contribution) + " per month, you could reach your goal in " + months + (months === 1 ? " month." : " months.");
    });
}

function initializeExpensePlanner(){
    const form = document.getElementById("expense-form");
    if(!form){
        return;
    }

    const rows = document.getElementById("expense-rows");
    const totalLabel = document.getElementById("expense-total");
    const remainingLabel = document.getElementById("expense-remaining");
    const budgetLabel = document.getElementById("expense-budget");
    const error = document.getElementById("expense-error");
    let expenses = [];
    let profile = null;
    try{
        expenses = JSON.parse(localStorage.getItem("budgetbasicsExpenses") || "[]");
        profile = JSON.parse(localStorage.getItem("budgetbasicsProfile") || "null");
    }catch{
        expenses = [];
    }
    const budget = profile && Number(profile.budget) > 0 ? Number(profile.budget) : 1200;

    function renderExpenses(){
        rows.replaceChildren();
        let total = 0;
        if(expenses.length === 0){
            const emptyRow = document.createElement("tr");
            emptyRow.className = "empty-row";
            const emptyCell = document.createElement("td");
            emptyCell.colSpan = 5;
            emptyCell.textContent = "No expenses added yet.";
            emptyRow.appendChild(emptyCell);
            rows.appendChild(emptyRow);
        }

        expenses.forEach(function(expense,index){
            total += expense.amount;
            const row = document.createElement("tr");
            [new Date(expense.date + "T00:00:00").toLocaleDateString(),expense.category,expense.description,formatNaira(expense.amount)].forEach(function(value){
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });
            const actionCell = document.createElement("td");
            const removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.className = "row-action";
            removeButton.textContent = "Remove";
            removeButton.setAttribute("aria-label","Remove " + expense.description);
            removeButton.addEventListener("click",function(){
                expenses.splice(index,1);
                localStorage.setItem("budgetbasicsExpenses",JSON.stringify(expenses));
                renderExpenses();
            });
            actionCell.appendChild(removeButton);
            row.appendChild(actionCell);
            rows.appendChild(row);
        });

        totalLabel.textContent = "Total: " + formatNaira(total);
        remainingLabel.textContent = formatNaira(Math.max(0,budget - total));
        budgetLabel.textContent = formatNaira(budget);
    }

    form.addEventListener("submit",function(event){
        event.preventDefault();
        const amount = Number(document.getElementById("expense-amount").value);
        if(amount <= 0 || !Number.isFinite(amount)){
            error.textContent = "Enter an expense amount greater than zero.";
            return;
        }
        error.textContent = "";
        expenses.push({
            date:document.getElementById("expense-date").value,
            category:document.getElementById("expense-category").value,
            description:document.getElementById("expense-description").value.trim(),
            amount:amount
        });
        localStorage.setItem("budgetbasicsExpenses",JSON.stringify(expenses));
        form.reset();
        renderExpenses();
    });

    renderExpenses();
}

function initializeNeedsVsWants(){
    const prompt = document.getElementById("item-prompt");
    const feedback = document.querySelector("[data-classification-feedback]");
    if(!prompt || !feedback){
        return;
    }

    const examples = [
        {label:"A weekly grocery shop",type:"need"},
        {label:"A premium streaming subscription",type:"want"},
        {label:"Prescription medicine",type:"need"},
        {label:"A concert ticket",type:"want"},
        {label:"Bus fare to class",type:"need"}
    ];
    let current = 0;

    document.querySelectorAll("[data-classification]").forEach(function(button){
        button.addEventListener("click",function(){
            if(button.dataset.classification === examples[current].type){
                feedback.textContent = "Correct. " + examples[current].label + " is a " + examples[current].type + ".";
                feedback.className = "feedback success";
                current = (current + 1) % examples.length;
                prompt.textContent = examples[current].label;
            }else{
                feedback.textContent = "Take another look, then choose again.";
                feedback.className = "feedback error";
            }
        });
    });
}

function enforceAuthentication(){
    if(document.body.dataset.requiresAuth !== "true"){
        return;
    }
    if(localStorage.getItem("budgetbasicsLoggedIn") !== "true"){
        window.location.replace("../index.html#login");
    }
}

function initializeVisitorCounter(){
    if(document.body.dataset.requiresAuth !== "true" || localStorage.getItem("budgetbasicsLoggedIn") !== "true"){
        return;
    }

    const brand = document.querySelector(".site-brand, .nav-logo");
    if(!brand){
        return;
    }

    let visitCount = Number(localStorage.getItem("budgetbasicsBrowserVisits"));
    if(!Number.isSafeInteger(visitCount) || visitCount < 0){
        visitCount = 0;
    }
    if(sessionStorage.getItem("budgetbasicsVisitRecorded") !== "true"){
        visitCount++;
        localStorage.setItem("budgetbasicsBrowserVisits",String(visitCount));
        sessionStorage.setItem("budgetbasicsVisitRecorded","true");
    }

    let counter = brand.querySelector(".visit-counter");
    if(!counter){
        counter = document.createElement("span");
        counter.className = "visit-counter";
        counter.setAttribute("role","img");
        const eye = document.createElementNS("http://www.w3.org/2000/svg","svg");
        eye.setAttribute("viewBox","0 0 24 24");
        eye.setAttribute("aria-hidden","true");
        eye.setAttribute("focusable","false");
        const outline = document.createElementNS("http://www.w3.org/2000/svg","path");
        outline.setAttribute("d","M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z");
        const pupil = document.createElementNS("http://www.w3.org/2000/svg","circle");
        pupil.setAttribute("cx","12");
        pupil.setAttribute("cy","12");
        pupil.setAttribute("r","2.5");
        eye.append(outline,pupil);
        const number = document.createElement("span");
        number.className = "visit-counter-value";
        counter.append(eye,number);
        brand.appendChild(counter);
    }
    counter.querySelector(".visit-counter-value").textContent = visitCount.toLocaleString();
    counter.setAttribute("aria-label","Browser visits: " + visitCount);
    counter.title = "Visits recorded in this browser only";
}

function initializeResourceLibrary(){
    const search = document.getElementById("resource-search");
    const category = document.getElementById("resource-category");
    const sort = document.getElementById("resource-sort");
    const cards = Array.from(document.querySelectorAll("[data-resource-card]"));
    const count = document.getElementById("resource-count");
    const emptyState = document.getElementById("resource-empty");
    if(!search || !category || !sort || cards.length === 0){
        return;
    }

    function updateResources(){
        const query = search.value.trim().toLocaleLowerCase();
        const selectedCategory = category.value;
        const visibleCards = cards.filter(function(card){
            const matchesText = card.textContent.toLocaleLowerCase().includes(query);
            const matchesCategory = selectedCategory === "all" || card.dataset.category === selectedCategory;
            card.hidden = !(matchesText && matchesCategory);
            return !card.hidden;
        });
        visibleCards.sort(function(first,second){
            const firstTitle = first.querySelector("h2,h3").textContent.trim();
            const secondTitle = second.querySelector("h2,h3").textContent.trim();
            const order = firstTitle.localeCompare(secondTitle);
            return sort.value === "title-desc" ? -order : order;
        }).forEach(function(card){
            card.parentElement.appendChild(card);
        });
        if(count){
            count.textContent = visibleCards.length + (visibleCards.length === 1 ? " resource" : " resources");
        }
        if(emptyState){
            emptyState.hidden = visibleCards.length > 0;
        }
    }

    search.addEventListener("input",updateResources);
    category.addEventListener("change",updateResources);
    sort.addEventListener("change",updateResources);
    document.getElementById("resource-reset")?.addEventListener("click",function(){
        search.value = "";
        category.value = "all";
        sort.value = "title-asc";
        updateResources();
    });
    updateResources();
}

function initializeAssistant(){
    const form = document.getElementById("assistant-form");
    const input = document.getElementById("assistant-question");
    const conversation = document.getElementById("assistant-conversation");
    if(!form || !input || !conversation){
        return;
    }

    function addMessage(text,speaker){
        const message = document.createElement("p");
        message.className = "assistant-message " + speaker;
        message.textContent = text;
        conversation.appendChild(message);
        conversation.scrollTop = conversation.scrollHeight;
    }

    function answerQuestion(question){
        const query = question.toLocaleLowerCase();
        if(query.includes("need") && query.includes("want")){
            return "Needs are essential costs for health, safety, work, or school. Wants are optional purchases. Some costs depend on your situation, so consider what is essential for you.";
        }
        if(query.includes("budget")){
            return "Start with the money you expect to receive. List essential costs, set aside a realistic savings amount, then plan flexible spending with what remains.";
        }
        if(query.includes("sav") || query.includes("goal")){
            return "Choose a specific target, note what you have already saved, and decide on a regular contribution you can maintain. The Savings Goals tool can estimate the timeline.";
        }
        if(query.includes("expense") || query.includes("spend")){
            return "Record costs as they happen and group them into useful categories. The Expense Planner can help organize upcoming costs against your available budget.";
        }
        if(query.includes("stress") || query.includes("overwhelm")){
            return "Pick one small next step: write down your current balance, list the next essential bill, or review one spending category. You do not need to solve everything at once.";
        }
        return "I can answer basic questions about budgets, savings goals, expenses, and needs versus wants. Try one of those topics.";
    }

    function ask(question){
        const cleanQuestion = question.trim();
        if(!cleanQuestion){
            return;
        }
        addMessage(cleanQuestion,"user");
        addMessage(answerQuestion(cleanQuestion),"assistant");
        input.value = "";
        input.focus();
    }

    form.addEventListener("submit",function(event){
        event.preventDefault();
        ask(input.value);
    });
    document.querySelectorAll("[data-assistant-question]").forEach(function(button){
        button.addEventListener("click",function(){
            ask(button.dataset.assistantQuestion);
        });
    });
}

enforceAuthentication();
initializeVisitorCounter();
initializeNavigation();
initializeSavingsCalculator();
initializeExpensePlanner();
initializeNeedsVsWants();
initializeResourceLibrary();
initializeAssistant();

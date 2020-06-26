//const baseURL = `https://api.edamam.com/search`
//const apiKey = `apikey=bb3b34b5	`

//const testCall1 = 
'https://api.edamam.com/search?q=chicken&app_id=ded1159b&app_key=6f0083a34105d7037ac077947594f3ed'

let recipeObjs;
let areRecipes = false;
let areIngredients = false;
$(() => {

//handles the search button to call the API with the users query text and then it'll build and return different recipes
    $('#submit').click(function(){
        //grab the text from the search box
        const text = $('#input-box').val();
        
        const recipeQuery = text.replace(/ /g, '%20');//replacing all spaces with a regex (defines the search pattern) and %20 so URL won't read it as a an invalid character

        const call = 'https://api.edamam.com/search?q='+recipeQuery+'&app_id=ded1159b&app_key=6f0083a34105d7037ac077947594f3ed'; //concatenate the recipeQuery inside of the API
//if there was a previous call that filled recipes div (keeps from replicating the recipes after clicking search)
        if(areRecipes){
            $('#recipes').empty(); //clear out the old recipes
        }
        $.ajax({url: call, success: function(result){
            console.log(result);
            //array of the recipes relating to the search term
            const hits = result.hits;   
            //reinitialize array to empty         
            recipeObjs = [];
     //iterate the recipe array and create recipe cards and add them to recipe div
            for(let i = 0; i < hits.length; i++) {
                //recipe obtained from object in recipes array
                const hit = hits[i];
                const recipe = hit.recipe;
                //push recipe into recipeObjs array
                recipeObjs.push(recipe);
                //each recipe card needs a class of recipe-card. addClass 
                const $recipeCard = $('<div>').addClass('recipe-card').attr('recipe-num', i)
        //link and header of anchor tag (link) with recipe header class (target=_blank to open new tab)
                const $titleLink = $('<a>').attr('href', recipe.url).attr('target', '_blank').addClass('recipe-header').text(recipe.label);
                //adding anchor to the recipe-card
                $recipeCard.append($titleLink);
                //select recipe via checkbox (circle @ upper right of recipe-card)
                const $input = $('<input>').attr('type', 'checkbox').attr("name","select-item").addClass('recipe-select');
                //adding input to recipe-card (places circle on recipe-card)
                $recipeCard.append($input);
         //image for the recipe card
                const $image = $('<img>').attr('src', recipe.image).attr('alt', recipe.label + ' image').addClass('recipe-image')
                //places image on recipe-card
                $recipeCard.append($image);
                //fork and knife icon - hover over to show diet list
                const $diet = $('<i>').addClass('ttip diet fa fa-cutlery').attr('type', 'dietLabels');
         //get text. builds HTML string to go into tooltip
                const strDiet = addStrToTip(recipe.dietLabels,"Diets")
                //diet tooltip
                const $dietTip = $('<span>').addClass('ttiptext diet').css("font-family", "'Open Sans', sans-serif;").html(strDiet)
                //add tip to icon
                $diet.append($dietTip);
                //add icon to recipe-card
                $recipeCard.append($diet);
                //medical bag icon - hover over to see health list
                const $health = $('<i>').addClass('ttip health fa fa-medkit').attr('type', 'healthLabels');
                //get text
                const strHealth = addStrToTip(recipe.healthLabels,"Health")
                //diet tooltip
                const $healthTip = $('<span>').addClass('ttiptext health').html(strHealth)
                //add tip to icon
                $health.append($healthTip);
                //add icon to recipe-card
                $recipeCard.append($health);
                //caution icon - hover over to see important information about recipe
                const $caut = $('<i>').addClass('ttip caution fa fa-exclamation-circle').attr('type', 'cautions');
                //get text
                const strCaut = addStrToTip(recipe.cautions,"Caution")
                //diet tooltip
                const $cautTip = $('<span>').addClass('ttiptext caut').html(strCaut)
                //add tip to icon
                $caut.append($cautTip);
                //add icon to recipe-card
                $recipeCard.append($caut);
                /*//heart icon - hover over to how nutrition
                const $nutri = $('<i>').addClass('ttip nutrient fa fa-heart').attr('type', 'totalNutrients');
                //get text
                const strNutri = addObjStrToTip(recipe.totalNutrients,"Nutrition")
                //diet tooltip
                const $nutriTip = $('<span>').addClass('ttiptext nutri').html(strNutri)
                //add tip to icon
                $nutri.append($nutriTip);
                //add icon to recipe-card
                $recipeCard.append($nutri);*/
                //places recipe-card in div
                $('#recipes').append($recipeCard);
            }
            areRecipes = true;
        }});

    });

//clicking circular checkbox will hide list of recipes you didn't click on and adds ingredients to the one clicked

    //check or uncheck of checkbox
    $('#recipes').on("change", ".recipe-card :checkbox", function () {
        //recipe card has just been checked
        if(this.checked){
            //hides the other recipe-cards that aren't clicked
            $(this).parent().siblings('.recipe-card').hide()
            //if there are ingredients, it empties it out
            if(areIngredients){
                $('#ingredients').empty()
            }
     //setting a variable to recipeCard that was clicked. go from checkbox to parent(div)
            const $recipeCard = $(this).parent();
            // grab the index of the element that is in the recipe object array
            const index = parseInt($recipeCard.attr('recipe-num'));
            //get recipe object containing recipe ingredients etc
            const recipeObj = recipeObjs[index];
            //declares and sets variable to ingredients array of recipe
            const ingredients = recipeObj.ingredients;
            //loops through ingredients in array
            for (let i = 0; i < ingredients.length; i++) {
                //create ingredient variable to hold ingredient object
                const ingredient = ingredients[i];
                //creates div for each ingredient with class of ingredient-card 
                const $card = $('<div>').addClass('ingredient-card');
                //create input of type checkbox with name of ingredients w/ class of has-ingredient. Each ingredient will have a name
                const $input = $('<input>').attr('type', 'checkbox').addClass('has-ingredient');
                //create variable and set it to label
                const $label = $('<label>').attr('for', 'ing' + i).text(ingredient.text);
                //append the checkbox input to the .ingredient-card
                $card.append($input);
                //append the label to the .ingredient-card
                $card.append($label);
                //appends ingredient-card div to #ingredients div. places ingredient in div
                $('#ingredients').append($card);
            }    
            areIngredients = true;
        }    
    //recipe card has just been unchecked
        else {
            //show all of the hidden divs that were not selected
            $(this).parent().siblings('.recipe-card').show()
            //empty the ingredients list which we can refill when a recipe is selected
            $('#ingredients').empty()
            //set variable to false since #ingredients is empty
            areIngredients = false;
        }

    })

    //builds HTML string out of an array of strings
    const addStrToTip = (itemsArr, title)=>{
        //title of each tootip
        let string = "<b>"+title+"<b></br>";
        //title if there are no items in array
        if(itemsArr.length === 0){
            string = "No "+title;
        }
        //looping through items and adding to string
        for(let i = 0; i<itemsArr.length; i++){
            string += itemsArr[i] + "</br>"
        }
        return string;
    };

    //creating an HTML tooltip from an object and its propery values
    const addObjStrToTip = (obj, title)=>{
        let string = "<b>"+title+"<b></br>";
        //loops through object propeties
        for(let prop in obj){
            //gets an object value from key
            const nutriObj = obj[prop];
            //creates line for tooltip
            string += nutriObj.label + " " + nutriObj.quantity.toFixed(2) + " " + nutriObj.unit +"<br>"
        }
        return string;
    };

})
    


    
    
    
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
                    const $recipeCard = $('<div>').addClass('recipe-card').attr('recipe-num', i).text(recipe.label)
                    //add recipe-card to recipe div
                    $('#recipes').append($recipeCard);
                }
                areRecipes = true;
            }});

        });
        //a click for every recipe item that will create the list of ingredient items from that recipe
        $('#recipes').on("click", 'div.recipe-card',function(){
            //if there are ingredients
            if(areIngredients){
                $('#ingredients').empty()
            }
            //setting a variable to recipeCard that was clicked
            const $recipeCard = $(this);
            // grab the index of the element that is in the recipe object array
            const index = parseInt($recipeCard.attr('recipe-num'));
            //get recipe object containing recipe ingredients etc
            const recipeObj = recipeObjs[index];
            //declares and sets variable to ingredients array of recipe
            const ingredients = recipeObj.ingredients;
            //iterates over the elements within ingredients array 
            for (let i = 0; i < ingredients.length; i++) {
                //create ingredient variable to hold ingredient object
                const ingredient = ingredients[i];
                //creates div for each ingredient with class of ingredient-card 
                const $card = $('<div>').addClass('ingredient-card');
                //create input of type checkbox with name of ingredients w/ class of has-ingredient. Each ingredient will have a name
                const $input = $('<input>').attr('type', 'checkbox').attr('name', 'ing' + i).addClass('has-ingredient');
                //create variable and set it to label
                const $label = $('<label>').attr('for', 'ing' + i).text(ingredient.text);
                //append the input to the .ingredient-card
                $card.append($input);
                //append the label to the .ingredient-card
                $card.append($label);
                //appends ingredient-card div to #ingredients div
                $('#ingredients').append($card);
            }    
            areIngredients = true;






        })

    })
    
    
    
    
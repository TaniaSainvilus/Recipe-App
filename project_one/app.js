const baseURL = `https://api.edamam.com/search`
const apiKey = `apikey=bb3b34b5	`
const queryType = `t=`

const testCall1 = 
'https://api.edamam.com/search?q=chicken&app_id=ded1159b&app_key=6f0083a34105d7037ac077947594f3ed'

const recipeObjs;

$(() => {

    //handles the search button to call the API with the users query text and then it'll build and return different recipes

        $('#submit').click(function(){
            const text = $('#input-box').val();
            
            const recipeQuery = text.replace(/ /g, '%20');//replacing all spaces with a regex (defines the search pattern) and %20 so URL won't read it as a an invalid character

            const call = 'https://api.edamam.com/search?q='+recipeQuery+'&app_id=ded1159b&app_key=6f0083a34105d7037ac077947594f3ed'; //concatenate the recipeQuery inside of the API

            $.ajax({url: cabll, success: function(result){
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
                    const $recipeCard = $('<div>').addClass('recipe-card').text(recipe.label)
                    //add recipe-card to recipe div
                    $('#recipes').append($recipeCard);
                }

            }});

        });

        //a click for every recipe item that will create the list of ingredient items from that recipe
        $('.recipe-item').on("click",function(){
            const $blurb = $(this).parent().remove();
            $blurb.addClass('done-item').removeClass('to-do-item');
            const $btn = $blurb.children('.completeBtn');
            $btn.addClass('removeBtn').removeClass('completeBtn').text('Remove');
        //remove task when done
            $btn.click(function(){
                $(this).parent().remove();
            })
            $('#completed').append($blurb)
        })

        $('.').on("click",function(){

        });
    
    })
    
    
    
    
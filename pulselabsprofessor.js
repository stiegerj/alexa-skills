'use strict';

const answer_right = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/pulselabsprofessor/Answer.Right.mp3' /> ";
const answer_wrong = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/pulselabsprofessor/Answer.Wrong.mp3' /> ";
const be_adaptable = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/pulselabsprofessor/Be.Adaptable.mp3' /> ";
const be_available = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/pulselabsprofessor/available_redo.mp3' /> ";
const be_contextual = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/pulselabsprofessor/contextual_redo.mp3' /> ";
const congratulations = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/pulselabsprofessor/Congratulations.mp3' /> ";
const exit = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/pulselabsprofessor/Exit.mp3' /> ";
const fallback_contextual = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/pulselabsprofessor/Fallback.A.mp3' /> ";
const fallback_contextual_adaptable = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/pulselabsprofessor/Fallback.AB.mp3' /> ";
const fallback_contextual_adaptable_available = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/pulselabsprofessor/Fallback.ABC.mp3' /> ";
const fallback_adaptable = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/pulselabsprofessor/Fallback.B.mp3' /> ";
const fallback_adaptable_available = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/pulselabsprofessor/Fallback.BC.mp3' /> ";
const fallback_available = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/pulselabsprofessor/Fallback.C.mp3' /> ";
const fallback_contextual_available = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/pulselabsprofessor/Fallback.AC.mp3' /> ";
const fallback_none = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/pulselabsprofessor/Fallback.none.mp3' /> ";
const fallback_base = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/pulselabsprofessor/Fallback.base.mp3' /> ";
const help = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/pulselabsprofessor/Help.mp3' /> ";
const intro_1 = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/pulselabsprofessor/Intro.1.mp3' /> ";
const intro_2 = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/pulselabsprofessor/Intro_redo.mp3' /> ";
const one_adaptable = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/pulselabsprofessor/One.adaptable.mp3' /> ";
const one_available = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/pulselabsprofessor/One.available.mp3' /> ";
const one_contextual = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/pulselabsprofessor/One.contextual.mp3' /> ";
const quiz_open = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/pulselabsprofessor/Quiz.Open.mp3' /> ";
const returning = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/pulselabsprofessor/Returning.mp3' /> ";
const two_adaptable = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/pulselabsprofessor/Two.adaptable.mp3' /> ";
const two_available = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/pulselabsprofessor/Two.available.mp3' /> ";
const two_contextual = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/pulselabsprofessor/Two.contextual.mp3' /> ";
const voicefirst = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/pulselabsprofessor/VoiceFirst.mp3' /> ";
const airhorn = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/mlg-airhorn.mp3' /> ";
const answer_wrong2 = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/pulselabsprofessor/answer_wrong2.mp3' /> ";
const end_of_intro = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/pulselabsprofessor/end_of_intro2.mp3' /> ";
const adaptable_confirm = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/pulselabsprofessor/adaptable_confirm.mp3' /> ";
const available_confirm = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/pulselabsprofessor/available_confirm.mp3' /> ";
const contextual_confirm = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/pulselabsprofessor/contextual_confirm.mp3' /> ";

exports.handler = function(event, context){
    try{
        var request = event.request;
        let options = {};
        options.session={};
        

        if(!event.session.attributes){
            event.session.attributes={};
        }

        options.session.attributes = event.session.attributes;

        if(request.type === "LaunchRequest"){
            options.speechText = intro_1 + voicefirst + intro_2;
            options.repromptText = options.speechText;
            options.endSession=false;
            options.session.attributes.previousIntent = "launch";
            context.succeed(buildResponse(options));
        }

        
        else if (request.type === "IntentRequest"){

            if(!request.intent.name === "AMAZON.YesIntent" && !request.intent.name === "AMAZON.NoIntent"){
                options.session.attributes.confirm = false;
                options.session.attributes.third = false;
            }

            if(!request.intent.name === "CorrectResponseIntent" && !request.intent.name === "IncorrectResponseIntent"){
                options.session.attributes.quizStarted = false;
            }

            if(!options.session.attributes.contextual || !options.session.attributes.adaptable || !options.session.attributes.available || (options.session.attributes.previousIntent != "available" && options.session.attributes.previousIntent != "adaptable" && options.session.attributes.previousIntent != "contextual")){
                options.session.attributes.congratulations = false;
            }

            if(request.intent.name === "AMAZON.StopIntent" || request.intent.name === "AMAZON.CancelIntent"){
                options.speechText = exit;
                options.endSession=true;
                context.succeed(buildResponse(options));
            }

            else if(request.intent.name === "SelectIntent"){
                if(!request.intent.slots.ListPosition.value && !request.intent.slots.PositionRelation.value){
                    fallback(options,context);
                }

                else{
                    let prev = options.session.attributes.previousIntent;
                    let pos = request.intent.slots.ListPosition.value;
                        if(!request.intent.slots.ListPosition.value){
                            pos = request.intent.slots.PositionRelation.value;
                        }

                    switch(prev){
                        case "launch":
                            switch(pos){
                                case "1":
                                    adaptable(options,context);
                                break;
                                case "2":
                                    contextual(options,context);
                                break;
                                case 3:
                                case "last":
                                    available(options,context);
                                break;
                                default:
                                    fallback(options,context);
                            }
                        break;
                        case "adaptable":
                            if(options.session.attributes.contextual || options.session.attributes.available){
                                fallback(options,context);
                            }
                            else{
                                switch(pos){
                                    case "1":
                                        contextual(options,context);
                                    break;
                                    case "2":
                                    case "last":
                                        available(options,context);
                                    break;
                                    default:
                                        fallback(options,context);
                                }
                            }
                        break;
                        case "contextual":
                            if(options.session.attributes.adaptable || options.session.attributes.available){
                                fallback(options,context);
                            }
                            else{
                                switch(pos){
                                    case "1":
                                        available(options,context);
                                    break;
                                    case "2":
                                    case "last":
                                        adaptable(options,context);
                                    break;
                                    default:
                                        fallback(options,context);
                                }
                            }
                        break;
                        case "available":
                            if(options.session.attributes.contextual || options.session.attributes.adaptable){
                                fallback(options,context);
                            }
                            else{
                                switch(pos){
                                    case "1":
                                        context(options,context);
                                    break;
                                    case "2":
                                    case "last":
                                        adaptable(options,context);
                                    break;
                                    default:
                                        fallback(options,context);
                                }
                            }
                        break;
                        case "quiz":
                            switch(pos){
                                case "1":
                                case "2":
                                case "3":
                                    options.speechText = answer_wrong + answer_wrong2;
                                    options.endSession = true;
                                    context.succeed(buildResponse(options));
                                break;
                                case "4":
                                case "last":
                                    options.speechText = answer_right;
                                    options.endSession = true;
                                    context.succeed(buildResponse(options));
                                    break;
                                default:
                                    fallback(options,context);
                            }
                        break;
                        case "help":
                            switch(pos){
                                case "1":
                                    adaptable(options,context);
                                break;
                                case "2":
                                    contextual(options,context);
                                break;
                                case "3":
                                    available(options,context);
                                break;
                                case "4":
                                case "last":
                                    options.speechText = quiz_open;
                                    options.repromptText = options.speechText;
                                    options.session.attributes.quizStarted = true;
                                    options.session.attributes.previousIntent = "quiz";
                                    options.endSession = false;
                                    context.succeed(buildResponse(options));
                                default:
                            }
                        break;
                        case "fallback":
                            let att = options.session.attributes;
                            if(!att.available && !att.adaptable && !att.contextual){
                                switch(pos){
                                    case "1":
                                        available(options,context);
                                    break;
                                    case "2":
                                        contextual(options,context);
                                    break;
                                    case "3":
                                    case "last":
                                        adaptable(options,context);
                                    break;
                                    default:
                                        fallback(options,context);
                                }
                            }
                            else if(att.available && !att.adaptable && !att.contextual){
                                switch(pos){
                                    case "1":
                                        adaptable(options,context);
                                    break;
                                    case "2":
                                    case "last":
                                        contextual(options,context);
                                    break;
                                    default:
                                        fallback(options,context);
                                }
                            }
                            else if(!att.available && att.adaptable && !att.contextual){
                                switch(pos){
                                    case "1":
                                        available(options,context);
                                    break;
                                    case "2":
                                    case "last":
                                        contextual(options,context);
                                    break;
                                    default:
                                        fallback(options,context);
                                }
                            }
                            else if(!att.available && !att.adaptable && att.contextual){
                                switch(pos){
                                    case "1":
                                        available(options,context);
                                    break;
                                    case "2":
                                    case "last":
                                        adaptable(options,context);
                                    break;
                                    default:
                                        fallback(options,context);
                                }
                            }
                            else{
                                fallback(options,context);
                            }
                        break;    
                        default:
                            fallback(options,context); 
                    } // end of switch on previousIntent */
                } //end of selectable options 
            } //end of SelectIntent

           else if(request.intent.name === "AdaptableIntent"){
                if(options.session.attributes.adaptable && (!options.session.attributes.contextual || !options.session.attributes.available)){
                    options.speechText = adaptable_confirm;
                    options.repromptText = options.speechText;
                    options.endSession = false;
                    options.session.attributes.previousIntent = "adaptable";
                    options.session.attributes.third = false;
                    options.session.attributes.confirm = true;
                    context.succeed(buildResponse(options));
                }
                else{
                    options.session.attributes.previousIntent = "adaptable";
                    adaptable(options, context);
                }
            }

           else if(request.intent.name === "AvailableIntent"){
                if(options.session.attributes.available && (!options.session.attributes.contextual || !options.session.attributes.adaptable)){
                    options.speechText = available_confirm;
                    options.session.attributes.third = false;
                    options.repromptText = options.speechText;
                    options.endSession = false;
                    options.session.attributes.previousIntent = "available";
                    options.session.attributes.confirm = true;
                    context.succeed(buildResponse(options));
                }
                else{
                    options.session.attributes.previousIntent = "available";
                    available(options, context);
                }
            }

           else if(request.intent.name === "ContextualIntent"){
                if(options.session.attributes.contextual && (!options.session.attributes.adaptable || !options.session.attributes.available)){
                    options.speechText = contextual_confirm;
                    options.session.attributes.third = false;
                    options.repromptText = options.speechText;
                    options.endSession = false;
                    options.session.attributes.previousIntent = "contextual";
                    options.session.attributes.confirm = true;
                    context.succeed(buildResponse(options));
                }
                else{
                    options.session.attributes.previousIntent = "contextual";
                    contextual(options, context);
                }
            }

           else if(request.intent.name === "AMAZON.NoIntent"){
               no(options, context);
           }

            else if(request.intent.name === "AMAZON.YesIntent"){
                yes(options, context);
            }

            else if(request.intent.name === "StartQuizIntent"){
                options.speechText = quiz_open;
                options.repromptText = options.speechText;
                options.session.attributes.quizStarted = true;
                options.session.attributes.previousIntent = "quiz";
                options.endSession = false;
                context.succeed(buildResponse(options));
            }

            else if(request.intent.name === "CorrectResponseIntent"){
                if(!options.session.attributes.quizStarted){
                    fallback(options,context);
                }
                else{
                    options.speechText = answer_right;
                    options.endSession = true;
                    context.succeed(buildResponse(options));
                }
            }

            else if(request.intent.name === "IncorrectResponseIntent"){
                if(!options.session.attributes.quizStarted){
                    fallback(options,context);
                }
                else{
                    options.speechText = answer_wrong + answer_wrong2;
                    options.endSession = true;
                    context.succeed(buildResponse(options));
                }
            }

            else if(request.intent.name === "AMAZON.FallbackIntent"){
                fallback(options, context);
            }

            else if(request.intent.name === "AMAZON.RepeatIntent"){
                switch(options.session.attributes.previousIntent){
                    case "help":
                        options.speechText = help;
                        options.repromptText = help;
                        options.session.attributes.previousIntent = "help";
                        options.endSession = false;
                        context.succeed(buildResponse(options));
                    break;
                    case "quiz":
                        options.speechText = quiz_open;
                        options.repromptText = options.speechText;
                        options.session.attributes.previousIntent = "quiz";
                        options.endSession = false;
                        context.succeed(buildResponse(options));
                    break;

                    case "yes":
                        yes(options, context);
                    break;

                    case "no":
                        no(options, context);
                    break;

                    case "adaptable":
                        adaptable(options, context);
                    break;

                    case "contextual":
                        contextual(options, context);
                    break;

                    case "available":
                        available(options, context);
                    break;

                    case "fallback":
                        fallback(options, context);
                    break;

                    case "launch":
                        options.speechText = intro_1 + voicefirst + intro_2;
                        options.repromptText = options.speechText;
                        options.endSession=false;
                        context.succeed(buildResponse(options));
                    break;
                }
                options.endSession = false;
                context.succeed(buildResponse(options));
            }

            else if(request.intent.name === "AMAZON.HelpIntent"){
                options.speechText = help;
                options.repromptText = help;
                options.session.attributes.previousIntent = "help";
                options.endSession = false;
                context.succeed(buildResponse(options));
            }

            else{ 
                context.fail("Unknown intent");
            }
        }

        else if(request.type === "SessionEndedRequest"){
        }
        else{
            context.fail("Unknown request type");
        }

    }
    catch(e){
        context.fail("Exception: "+e);
    }
};

/*
function set(inserting){
    var params = {
        TableName:table,
        userID:inserting,
    }
    docClient.put(params, function(err, data){
        if(err){
            console.error("Unable to add item. Error JSON:", JSON.stringify(err.null,2));
        }else{
            return data.Item;
        }
    });
}
function get(getting){
    var params = {
        TableName:table,
        userID:getting,
    }
    docClient.get(params, function(err, data){
        if(err){
            console.error("Unable to read item. Error JSON:", JSON.stringify(err.null,2));
        }else{
            console.log("Added item:",JSON.stringify(data,null,2));
        }
    });
}
*/

function no(options, context){
    if(!options.session.attributes.confirm && !options.session.attributes.third){
        fallback(options, context);
   }
   else{
        options.speechText = "";
        if(!options.session.attributes.contextual && !options.session.attributes.adaptable && !options.session.attributes.available){
            options.speechText += "this shouldn't happen. ";
        }
        else if(options.session.attributes.contextual && !options.session.attributes.adaptable && !options.session.attributes.available){
            options.speechText += fallback_contextual;
        }
        else if(options.session.attributes.contextual && options.session.attributes.adaptable && !options.session.attributes.available){
            options.speechText += fallback_contextual_adaptable;
        }
        else if(options.session.attributes.contextual && !options.session.attributes.adaptable && options.session.attributes.available){
            options.speechText += fallback_contextual_available;
        }
        else if(options.session.attributes.contextual && options.session.attributes.adaptable && options.session.attributes.available){
            options.speechText += fallback_contextual_adaptable_available;
        }
        else if(!options.session.attributes.contextual && options.session.attributes.adaptable && options.session.attributes.available){
            options.speechText += fallback_adaptable_available;
        }
        else if(!options.session.attributes.contextual && options.session.attributes.adaptable && !options.session.attributes.available){
            options.speechText += fallback_adaptable;
        }
        else if(!options.session.attributes.contextual && !options.session.attributes.adaptable && options.session.attributes.available){
            options.speechText += fallback_available;
        }
        options.repromptText = options.speechText;
        options.endSession = false;
        options.session.attributes.confirm = false;
        options.session.attributes.third = false;
        options.session.attributes.previousIntent = "no";
        context.succeed(buildResponse(options));
    }
}


function yes(options, context){
    if(options.session.attributes.confirm){
        if(options.session.attributes.previousIntent === "available"){
            available(options, context);
        }
        else if(options.session.attributes.previousIntent === "adaptable"){
            adaptable(options, context);
        }
        else if(options.session.attributes.previousIntent === "contextual"){
            contextual(options, context);
        }
        else{
            options.speechText = "something has gone seriously wrong. i think you're trying to confirm something but haven't tracked your previous intent. tell jessie to fix something ";
            options.repromptText = options.speechText;
            options.endSession = true;
            options.session.attributes.confirm = false;
            options.session.attributes.third = false;
            context.succeed(buildResponse(options));
        }
    }

    else if(options.session.attributes.third){
        if(!options.session.attributes.contextual && options.session.attributes.available && options.session.attributes.adaptable){
            contextual(options, context);
        }
        else if(options.session.attributes.contextual && !options.session.attributes.available && options.session.attributes.adaptable){
            available(options, context);
        }
        else if(options.session.attributes.contextual && options.session.attributes.available && !options.session.attributes.adaptable){
            adaptable(options, context);
        }
        
        else{
            options.speechText = "something has gone seriously wrong. i think you're trying to launch a third principle but you either have zero one or three principles done ";
            options.repromptText = options.speechText;
            options.endSession = true;
            options.session.attributes.confirm = false;
            options.session.attributes.third = false;
            context.succeed(buildResponse(options));
        }
    }

    else if(options.session.attributes.congratulations){
        options.speechText = quiz_open;
        options.repromptText = options.speechText;
        options.session.attributes.quizStarted = true;
        options.session.attributes.previousIntent = "quiz";
        options.endSession = false;
        context.succeed(buildResponse(options));
    }

    else{
        fallback(options, context);
    }
}

function fallback(options, context){
    options.speechText = fallback_base;
    if(!options.session.attributes.contextual && !options.session.attributes.adaptable && !options.session.attributes.available){
        options.speechText += fallback_none;
    }
    else if(options.session.attributes.contextual && !options.session.attributes.adaptable && !options.session.attributes.available){
        options.speechText += fallback_contextual;
    }
    else if(options.session.attributes.contextual && options.session.attributes.adaptable && !options.session.attributes.available){
        options.speechText += fallback_contextual_adaptable;
    }
    else if(options.session.attributes.contextual && !options.session.attributes.adaptable && options.session.attributes.available){
        options.speechText += fallback_contextual_available;
    }
    else if(options.session.attributes.contextual && options.session.attributes.adaptable && options.session.attributes.available){
        options.speechText += fallback_contextual_adaptable_available;
    }
    else if(!options.session.attributes.contextual && options.session.attributes.adaptable && options.session.attributes.available){
        options.speechText += fallback_adaptable_available;
    }
    else if(!options.session.attributes.contextual && options.session.attributes.adaptable && !options.session.attributes.available){
        options.speechText += fallback_adaptable;
    }
    else if(!options.session.attributes.contextual && !options.session.attributes.adaptable && options.session.attributes.available){
        options.speechText += fallback_available;
    }
    else{
        options.speechText = "oh god what happened. tell jessie something broke.";
    }
    options.repromptText = options.speechText;
    options.endSession = false;
    options.session.attributes.previousIntent = "fallback";
    context.succeed(buildResponse(options));
}


function adaptable(options, context){
        options.speechText = be_adaptable;
        options.session.attributes.adaptable = true;
        options.session.attributes.confirm = false;
        options.session.attributes.third = false;

        if(options.session.attributes.contextual && options.session.attributes.available){
            options.repromptText = congratulations;
            options.session.attributes.congratulations = true;
            options.speechText += options.repromptText; 
        }

        else if(!options.session.attributes.contextual && !options.session.attributes.available){
            options.repromptText = two_adaptable;
            options.speechText += options.repromptText;
        }

        else if(options.session.attributes.contextual){
            options.repromptText = one_available;
            options.speechText += options.repromptText;
            options.session.attributes.third = true;
        }

        else if(options.session.attributes.available){
            options.repromptText = one_contextual;
            options.speechText += options.repromptText;
            options.session.attributes.third = true;
        }

        else{
            options.repromptText = "Something has gone seriously wrong. tell Jessie to fix stuff in the adaptable flow ";
            options.speechText += options.repromptText;
        }

   options.endSession = false;
   options.session.attributes.previousIntent = "adaptable";
   context.succeed(buildResponse(options));
}

function available(options, context){
    options.speechText = be_available;
    options.session.attributes.available = true;
    options.session.attributes.confirm = false;
    options.session.attributes.third = false;

    if(options.session.attributes.contextual && options.session.attributes.adaptable){
        options.repromptText = congratulations;
        options.session.attributes.congratulations = true;
        options.speechText += options.repromptText;
    }

    else if(!options.session.attributes.contextual && !options.session.attributes.adaptable){
        options.repromptText = two_available;
        options.speechText += options.repromptText;
    }

    else if(options.session.attributes.contextual){
        options.repromptText = one_adaptable;
        options.speechText += options.repromptText;
        options.session.attributes.third = true;
    }

    else if(options.session.attributes.adaptable){
        options.repromptText = one_contextual;
        options.speechText += options.repromptText;
        options.session.attributes.third = true;
    }

    else{
        options.repromptText = "Something has gone seriously wrong. tell Jessie to fix stuff in the available flow ";
        options.speechText += options.repromptText;
    }

    options.endSession = false;
    options.session.attributes.previousIntent = "available";
    context.succeed(buildResponse(options));
}

function contextual(options, context){
    options.speechText = be_contextual;
    options.session.attributes.contextual = true;
    options.session.attributes.confirm = false;
    options.session.attributes.third = false;

    if(options.session.attributes.adaptable && options.session.attributes.available){
        options.repromptText = congratulations;
        options.session.attributes.congratulations = true;
        options.speechText += options.repromptText;
    }

    else if(!options.session.attributes.available && !options.session.attributes.adaptable){
        options.repromptText = two_contextual;
        options.speechText += options.repromptText;
    }

    else if(options.session.attributes.available){
        options.repromptText = one_adaptable;
        options.speechText += options.repromptText;
        options.session.attributes.third = true;
    }

    else if(options.session.attributes.adaptable){
        options.repromptText = one_available;
        options.speechText += options.repromptText;
        options.session.attributes.third = true;
    }

    else{
        options.repromptText = "Something has gone seriously wrong. tell Jessie to fix stuff in the contextual flow ";
        options.speechText += options.repromptText;
    }

    options.endSession = false;
    options.session.attributes.previousIntent = "contextual";
    context.succeed(buildResponse(options));
}

function buildResponse(options){
    var response = {
        version: "1.0",
        response: {
            outputSpeech: {
                type: "SSML",
                ssml: "<speak>"+options.speechText+"</speak>"
            },
            shouldEndSession: options.endSession
        }
    };

    if(options.repromptText){
        response.response.reprompt = {
            outputSpeech: {
                type: "SSML",
                ssml: "<speak>"+options.repromptText+"</speak>"
            }
        };
    }

    if(options.cardTitle){
        response.response.card = {
            type: "Simple",
            title: options.cardTitle
        };

        if(options.imageUrl){
            response.response.card.type = "Standard";
            response.response.card.text = options.cardContent;
            response.response.card.image = {
                smallImageUrl: options.imageUrl,
                largeImageUrl: options.imageUrl
            };
        }
        else{
            response.response.card.content = options.cardContent;
        }
    }

    if("session" in options && "attributes" in options.session){
        response.sessionAttributes = options.session.attributes;
    }

    return response;
}

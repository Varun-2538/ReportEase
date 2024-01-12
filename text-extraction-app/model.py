# Import necessary libraries
from huggingface_hub import InferenceClient  # For loading and using text generation models
import gradio as grad
import os  # For creating interactive web interfaces (not used in this code snippet)

# Load the Mistral-8x7B-Instruct-v0.1 model from Hugging Face Hub
model = InferenceClient("mistralai/Mixtral-8x7B-Instruct-v0.1")

# Define a function to format prompts for the model
def prompter(message):
 """
 Formats a prompt for the model, providing context and instructions.

 Args:
   message: The specific text prompt to be processed by the model.

 Returns:
   A formatted prompt string that includes system context and instructions.
 """

 system_prompt = (
     "You are a Lawyer with extreme knowledge in the Indian Penal Code (IPC) Sections. Using the extracted text give 6 applicable IPC Section and while stating the reason for your selection. End with I believe you should do further investigate the case to cross-check my suggestions. The IPC sections should be in list form: "
 )
 prompt = f"<s>[SYS] {system_prompt} [/SYS]"
 prompt += f"[INST] {message} [/INST]"
 return prompt

#Given text prompt for easier reading: 

#"You are a Professional Legal System Indicator with extreme knowledge on the Indian Laws and an expert in the Indian Penal Code (IPC) Sections. 
# Using the text prompt, give the applicable IPC Section for the scenario and why it is applicable by picking the relating sentence to the IPC you suggest. 
# Ensure to only give 5 IPC Suggestions and end with <I believe you should do a further investigation to cross-check my suggestions>. 
# The IPC sections should be in list form: "



# Define a function to generate text using the model
def generate( 
   prompt,
   temperature=0.2,
   max_new_tokens=512,
   top_p=0.96,
   repetition_penalty=1.0,
):
 """
 Generates text using the loaded model, with options for controlling the output.

 Args:
   prompt: The formatted prompt string to be used for text generation.
   temperature: Controls the randomness of the generated text (higher = more creative).
   max_new_tokens: The maximum number of tokens to generate.
   top_p: Controls the likelihood of selecting common words (higher = less surprising).
   repetition_penalty: Discourages the model from repeating itself.

 Returns:
   The generated text as a string.
 """

 # Ensure temperature and top_p are floats
 temperature = float(temperature)
 if temperature < 1e-2:
   temperature = 1e-2
 top_p = float(top_p)

 # Create a dictionary of generation parameters
 generate_kwargs = dict(
     temperature=temperature,
     max_new_tokens=max_new_tokens,
     top_p=top_p,
     repetition_penalty=repetition_penalty,
     do_sample=True,
     seed=42,
 )

 # Format the prompt using the prompter function
 correct_prompt = prompter(prompt)

 # Generate text using the model's text_generation method
 stream = model.text_generation(correct_prompt, **generate_kwargs, stream=True, details=True, return_full_text=True)
 output = ""
 for answer in stream:  # Build the output text incrementally
   output += answer.token.text

 return output

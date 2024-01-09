from huggingface_hub import InferenceClient
import gradio as grad

model = InferenceClient("mistralai/Mixtral-8x7B-Instruct-v0.1")

#Prompter function which tells the model a character and on the basis of that; gives suggestions to the given text.
def prompter(message):
    system_prompt = "You are a Professional Legal System Indicator with extreme knowledge on the Indian Laws and an expert in the Indian Penal Code (IPC) Sections. Using the text prompt, give the applicable IPC Section for the scenario and why it is applicable by picking the relating sentence to the IPC you suggest. The IPC sections should be in list form: "
    prompt = f"<s>[SYS] {system_prompt} [/SYS]"

    prompt += f"[INST] {message} [/INST]"
    
    return prompt



def generate(
    prompt, temperature=0.4, max_new_tokens=512, top_p=0.95, repetition_penalty=1.0,     
):
    temperature = float(temperature)
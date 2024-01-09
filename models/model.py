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
    if temperature <1e-2:
        temperature = 1e-2
    top_p = float(top_p)

    generate_kwargs = dict(
        temperature=temperature,
        max_new_tokens=max_new_tokens,
        top_p=top_p,
        repetition_penalty=repetition_penalty,
        do_sample=True,
        seed=42,
    )

    correct_prompt = prompter(prompt)

    stream = model.text_generation(correct_prompt, **generate_kwargs, stream=True, details=True, return_full_text=False)
    output = ""

    for answer in model:
        output += answer.token.text

    return output
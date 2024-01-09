import os
import csv
import re
import pandas as pd
from flask import Flask, request, jsonify, render_template, redirect, url_for, flash
from model import generate  # Import the generate function from another module

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")
# def load_ipc_dataset():
#     """
#     Loads the IPC dataset from a CSV file.

#     Returns:
#         A list of data rows (as lists) if the file is found, otherwise an error message.
#     """

#     dataset_filepath = "text-extraction-app/resources/dataset.txt"

#     try:
#         with open(dataset_filepath, "r", encoding="utf-8") as csvfile:
#             csv_reader = csv.reader(csvfile)
#             headers = next(csv_reader)  # Store the headers for potential use later
#             dataset_data = list(csv_reader)
#             return dataset_data

#     except FileNotFoundError:
#         return "Can't find dataset, please try again"


# def process_crime():
    
#     ipc_sections = generate(text_field)
#     return jsonify({'results': ipc_sections})
    
if __name__ == '__main__':
    app.run(debug=True)

# TODO: add routing to files, probably with flask. 
# TODO: Also uncomment IPC_Sections generation after filepath cleanup

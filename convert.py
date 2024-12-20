import csv
import json

csv_file_path = "/Users/joycequ/Downloads/27-Aug-2024-17-02-41.626701.txt27-Aug-2024-17-02-41.626701multi_1_strawberry-2.csv"
json_file_path = "/Users/joycequ/Downloads/chat_data.json"

def csv_to_json(csv_file_path, json_file_path, selected_columns, rename_columns):
    # Open the CSV file
    with open(csv_file_path, mode='r') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        
        # Filter and rename columns
        data = [
            {rename_columns.get(key, key): row[key] for key in selected_columns if key in row}
            for row in csv_reader
        ]
    
    # Write the filtered and renamed data to a JSON file
    with open(json_file_path, mode='w') as json_file:
        json.dump(data, json_file, indent=4)

# Columns to keep and renaming configuration
selected_columns = ['robot_query', 'human_utterance', 'max_action', 'action_map']  # Only keep these columns
rename_columns = {'robot_query': 'agentResponse', 'human_utterance' : 'userResponse', 'max_action' : 'max_goal', 'action_map' : 'action_map'}  # Rename 'id' to 'identifier'

# Convert
csv_to_json(csv_file_path, json_file_path, selected_columns, rename_columns)
print(f"Filtered CSV converted to JSON and saved to {json_file_path}")

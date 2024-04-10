import pandas as pd

# Define piece values
piece_values = {'P': 1, 'N': 3, 'B': 3, 'R': 5, 'Q': 9}
p_list=['N', 'B', 'R', 'Q']
# Read the CSV file
df = pd.read_csv('chess_data_3.csv')

# Initialize scores for white and black
score = 0

# Lists to store white and black scores after each move
scores = []


# Iterate through each row
for index, row in df.iterrows():
    # Get the first character of the move
    if( row['Move'][0] in p_list):
        move_piece=row['Move'][0]
    else:
        move_piece='P'
    
    # Update scores based on the moves
    if row['Player'] == 'White':
        if 'Yes' in row['Kill Moves']:
            black_piece_value = piece_values.get(move_piece, 0)
            score += black_piece_value
    else:
        if 'Yes' in row['Kill Moves']:
            white_piece_value = piece_values.get(move_piece, 0)
            score -= white_piece_value
    
    # Append scores after each move
    scores.append(score)

# Add columns for scores
df['Score'] = scores

# Save the updated dataframe to a new CSV file
df.to_csv('data_3.csv', index=False)

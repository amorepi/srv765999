#!/bin/bash

# 1 - Aggiunge tutte le modifiche allo staging area
git add .

# 2 - Genera il file temporaneo con la lista dei file modificati/nuovi
git status -s > modified.tmp

# Svuota o crea il file definitivo modified.txt
> modified.txt

# 3 - Ciclo loop: legge modified.tmp riga per riga
while read -r status_line; do
    # Salta le righe vuote se presenti
    [ -z "$status_line" ] && continue

    # Estrae solo il percorso del file, rimuovendo le lettere di stato (M, A, etc.)
    file_path=$(echo "$status_line" | awk '{print $2}')

    # --- TEST DI CONTROLLO ---
    # Estrae solo il nome del file escludendo la cartella per il controllo
    filename=$(basename "$file_path")
    # Se il file inizia con "modified.", lo salta ed evita l'auto-inclusione
    [[ "$filename" == modified.* ]] && continue
    [[ "$filename" == .env ]] && continue
    [[ "$filename" == .gitignore ]] && continue

    # Verifica se il file esiste fisicamente
    if [ -f "$file_path" ]; then
        # Scrive il nome del file modificato
        echo "$file_path" >> modified.txt
        
        # Scrive la riga di separazione iniziale '---------'
        echo "----------------------------------------" >> modified.txt
        
        # Scrive il contenuto reale del file
        cat "$file_path" >> modified.txt
        
        # Scrive la riga di separazione finale '---------'
        echo "----------------------------------------" >> modified.txt
    fi
done < modified.tmp

# 4 - Rimuove il file temporaneo
rm modified.tmp

# 5 - Copia il contenuto di modified.txt nella clipboard (Appunti)
if command -v clip.exe &> /dev/null; then
    cat modified.txt | clip.exe
    echo "Fatto! file 'modified.txt' generato e copiato nella clipboard."
elif command -v pbcopy &> /dev/null; then
    cat modified.txt | pbcopy
    echo "Fatto! file 'modified.txt' generato e copiato nella clipboard."
elif command -v xclip &> /dev/null; then
    cat modified.txt | xclip -selection clipboard
    echo "Fatto! file 'modified.txt' generato e copiato nella clipboard."
else
    echo "File 'modified.txt' generato, ma non è stato possibile copiarlo automaticamente nella clipboard."
fi

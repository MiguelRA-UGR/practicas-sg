#!/bin/bash

# Verificar si se proporcionó un argumento para el mensaje del commit
if [ $# -eq 0 ]; then
  # Si no se proporciona un argumento, utiliza la fecha actual como mensaje del commit
  commit_message="Commit realizado el $(date +'%Y-%m-%d %H:%M:%S')"
else
  # Si se proporciona un argumento, úsalo como mensaje del commit
  commit_message="$1"
fi

# Obtener el nombre de la rama actual
current_branch=$(git symbolic-ref --short HEAD)

# Realizar git add .
git add .

# Realizar git commit con el mensaje adecuado
git commit -m "$commit_message"

# Realizar git push a la rama actual
git push origin "$current_branch"

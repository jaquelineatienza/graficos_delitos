import pandas as pd
import numpy as np

# importancion del archivo del database
archivo_json = "delitos_2023.json"
archivo_json2 = "delitos_2022.json"
# df = pd.read_excel(archivo_excel, engine='openpyxl')
# df2 = pd.read_excel(archivo_excel2, engine='openpyxl')

df = pd.read_json("delitos_2023.json")
df2 = pd.read_json("delitos_2022.json")


df2['subtipo'] = df2['subtipo'].str.replace('Homicidios dolosos', 'Homicidio Doloso')

df2.to_json('delitos_2022.json', orient='records', indent=2)

print("Los cambios se han guardado en el archivo 'data.json'")
print("\nDataFrame resultante:")
print(df2)

# ? Combierte el archivo a json
# df.to_json("delitos_2023.json", orient="records", indent=2, force_ascii=False)
# df2.to_json("delitos_2022.json", orient="records", indent=2, force_ascii=False)






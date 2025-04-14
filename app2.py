import pandas as pd
import numpy as np

# importancion del archivo del database
archivo_excel = "delitos_2023.xlsx"
archivo_excel2 = "delitos_2022.xlsx"
df = pd.read_excel(archivo_excel, engine='openpyxl')
df2 = pd.read_excel(archivo_excel2, engine='openpyxl')

# ? Combierte el archivo a json
df.to_json("delitos_2023.json", orient="records", indent=2, force_ascii=False)
df2.to_json("delitos_2022.json", orient="records", indent=2, force_ascii=False)






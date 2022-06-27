#!/usr/bin/env python
# coding: utf-8

# In[22]:


import pandas as pd
import numpy as np
pd.set_option('display.max_rows', 500) 

#import or 'read' the csv file of the dataset
df_dpiData = pd.read_csv('device_performance_index.csv')
df_dpiData


# In[23]:


#function to calculate the Xmin and Xmax takinkg into account the 2 and 98 percentiles
def xMin_xMax_calculator (dataFrame):
    
    xMinxMax = dataFrame.loc[:, ~dataFrame.columns.isin(['Client_ID', 'Office_ID'])].quantile([0.02, 0.98])

    return xMinxMax

resultado = xMin_xMax_calculator(df_dpiData)
resultado


# In[24]:


#make a copy of the original data set, to perfrom operations with the data

dfCopy = df_dpiData.copy()
#iterate through the columns and normalize each value according to the given formula
for column in dfCopy.columns[2:]:
    x = ((dfCopy[column]-resultado[column][0.02])/(resultado[column][0.98]-resultado[column][0.02]))
    #because both Xmin and Xmax (2 and 98 percentiles) for BSOD_count are 0, meaning that values greater than cero
    #are actually considered outliers, I replaced inf and nan values from Xnorm calculation.
    with pd.option_context('mode.use_inf_as_na', True):
        x.fillna(0, inplace=True)
    x = x.apply(lambda v: min(1, max(0, v)))
    dfCopy[column] = x

dfCopy


# In[25]:


#iterate through the columns and flip the data over (1-v), except for the column System_Free_Space
for column in dfCopy.columns[2:8]:
    dfCopy[column] = dfCopy[column].apply(lambda v: 1-v)
dfCopy


# In[26]:


#created a list with the names of the columns just to then, sum the values for each row, excluding the Client_Id and Office_id
col_list = list(dfCopy)

del col_list[0:2]

dfCopy['DPI'] = (10/7) * dfCopy[col_list].sum(axis=1)


dfCopy


# In[27]:


# I add the calculated DPI to the original dataFrame just to show the raw data and the calculated DPI
df_dpiData['DPI'] = dfCopy['DPI']
df_dpiData


# In[28]:


#I group the data by client ID and generate some statistics based on the calculated DPI

#first I create quantile functions to aggregate later
def q25(x):
    return x.quantile(0.25)
def q75(x):
    return x.quantile(0.75)
client_group = df_dpiData.groupby(['Client_ID']).DPI.agg(['count', 'mean', 'std', 'median', 'min', 'max', q25, q75])
client_group


# #### Info between customers
# - The client with the best DPI is number 8 with mean value of 8.76  
# - The client with the worse DPI is number 2 with a mean value of 7.58. This has the greatest std and the lowest min value detected. It has the greatest number of devices tested  
# - Client 3 has the lowest number of devices tested
# 
# -------------------------------------------

# In[29]:


#Data was grouped by Client Id and by Office Id to evaluate differences between offices for each client.
agglist = ['count', 'mean', 'std', 'median', 'min', 'max', q25, q75]
clientAndOffice_group = df_dpiData.groupby(['Client_ID', 'Office_ID'])['DPI'].agg(agglist)
clientAndOffice_group.head(100)

#NaN values for std exist because there are some offices that have only one device producing data, hence the std
#cannot be calculated.


# In[30]:


#I filter the data by client and then group by Office ID to check statistics for the offices of each client
filter = df_dpiData['Client_ID'] == 9
clientx = df_dpiData.loc[filter].groupby(['Office_ID'])['DPI'].agg(agglist)
clientx.sort_values(['mean'], ascending=False)


# #### Info between offices for different clients
# 
# ##### Client 1
# 
# - office 520 has the best DPI, however there's only one device in that specific office. Office 341 follows with a mean DPI of 8.46  
# 
# ##### Client 2
# - office 291 and 637 have the highest mean DPI, but only one device in each of them  
# - office 704 and 573 have the highest std which means that the info provided by the divices in those offices is quite disperse 
# - there are 8 offices which mean DPI values are below 7 
# 
# ##### Client 3
# - It has only one office, with 77 devices
# - it's mean DPI is above 8.5
# 
# ##### Client 4
# - It has no office with a mean DPI lower than 7.5
# 
# ##### Client 5
# - It has no office with a mean DPI lower than 7.5
# - office 287 has the highest mean DPI with 9.24
# 
# ##### Client 6
# - office 23 and  499 have the lowest mean DPIs with 6.97 and 5.99 respectively.
# 
# ##### Client 7
# - has several offices with a mean DPI below 7
# - the lowest min value registered was for office 431 with a mean DPI of 3.39
# 
# ##### Client 8
# - No office with a mean DPI below 7.5
# - various offices with mean DPI values over 9
# 
# ##### Client 9
# - No office with a mean DPI below 7
# - highest mean DPI for office 325 with 8.33

# In[31]:


#Created a filter to see all the offices that have a mean DPI below 7
filter = clientAndOffice_group['mean'] <7
clientAndOffice_group[filter]


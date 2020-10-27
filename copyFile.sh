#!/bin/sh

for i in `seq 1 10000`
do
	cp /software/workspace/excelToJson/组织1.xlsx "/software/workspace/excelToJson/组织02$i.xlsx"
done

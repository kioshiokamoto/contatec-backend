SELECT  M.id,M.msjUserFromId,M.msjUserToId,M.createdAt,M.msj_contenido, 
	CONCAT(U.us_nombre,' ',U.us_apellido) as nameAmiwi ,U.avatar as ImagenAmiwi,
    U.id as idAmiwi
FROM mensaje M
	INNER JOIN (
		SELECT  
			CASE WHEN msjUserFromId > msjUserToId THEN msjUserFromId ELSE msjUserToId END muser1,
			CASE WHEN msjUserFromId <= msjUserToId THEN msjUserFromId ELSE msjUserToId END muser2,
			MAX(createdAt) AS max_createat
		FROM mensaje
		WHERE 1 IN (msjUserFromId, msjUserToId)
		GROUP BY muser1 , muser2 ) AS filtro
	ON((M.msjUserFromId IN(filtro.muser1, filtro.muser2)) AND 
		(M.msjUserToId IN(filtro.muser1, filtro.muser2)) AND 
        (M.createdAt = filtro.max_createat))
	INNER JOIN usuario U ON(CASE WHEN filtro.muser1 IN(1) THEN U.id=filtro.muser2 ELSE U.id=filtro.muser1 END)
ORDER BY 4 DESC;
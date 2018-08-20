select distinct CO.CMS_ACCOUNT_ID, CO.CREATION_DATE from BSL.BSL_CONTRACT CO
join BSL.BSL_CLIENT_SNAPSHOT CS on CO.CLIENT_ID = CS.CLIENT_ID
where CS.BAN in ('123123123','124124124','125125125','126126126','127127127')
and trunc(CO.CREATION_DATE) = trunc(sysdate)
order by CO.CREATION_DATE desc;

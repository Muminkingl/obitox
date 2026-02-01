Thanks for Thatt
there is the issus ith the chart and fetching real data i have updated my db schemas table so now 

look i have `api_key_usage_daily` tabel and this example data to see how it work `[{"idx":0,"id":"1114dc51-2cc4-4296-88db-e3e2d2848e96","api_key_id":"c631e3f3-64e4-4c36-9d70-77275ff32ade","user_id":"fbe54d31-4aea-47ed-bb1d-e79fd66eae50","usage_date":"2026-01-24","total_requests":35,"successful_requests":32,"failed_requests":3,"total_file_size":12909,"total_files_uploaded":32,"created_at":"2026-01-24 15:45:08.322+00","updated_at":"2026-01-24 18:51:21.409+00"}]`

this is example so this table is suppose to shows daily api usage so make this CHart fetch from this table for that reason 


and for provider usages i have 2 tables 
one is `provider_usage_daily` which saves usages daily of providers here is example one of the data inside that `[{"idx":0,"id":"089c9eb7-6d4d-4a09-b4df-56a5ee9e0cd0","api_key_id":"c631e3f3-64e4-4c36-9d70-77275ff32ade","user_id":"fbe54d31-4aea-47ed-bb1d-e79fd66eae50","provider":"r2","usage_date":"2026-01-22","upload_count":6,"total_file_size":768,"created_at":"2026-01-22 17:37:09.327+00","updated_at":"2026-01-22 17:39:00.45+00"}]`

so make it fetc to this also for that reason !



and also i have `provider_usage` table here is the example on it also `[{"idx":0,"id":"1ebbb542-dfbc-4ae9-93cb-a1fedeb2bc94","api_key_id":"c631e3f3-64e4-4c36-9d70-77275ff32ade","user_id":"fbe54d31-4aea-47ed-bb1d-e79fd66eae50","provider":"r2","upload_count":27,"total_file_size":2682,"last_used_at":"2026-01-24 18:32:56.456+00","created_at":"2026-01-22 12:27:10.306395+00","updated_at":"2026-01-24 18:32:56.456+00","file_type_counts":"{\"text/plain\": 1}","average_file_size":99}]`





and for quota usage monthly dont edit this its working well !


so try to undertsand this and make a perfect startegy (ARCETETURE STYLE ) for this to make the usage section work !

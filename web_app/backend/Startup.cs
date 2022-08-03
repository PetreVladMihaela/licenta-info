using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using backend.Entities;
using backend.Repositories;
using backend.Managers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;


namespace backend
{
    public class Startup
    { 
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }


        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //Package Manager Console -> Install-Package Microsoft.AspNetCore.Mvc.NewtonsoftJson
            //services.AddControllersWithViews().AddNewtonsoftJson(options => options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);
            services.AddControllers();


            services.AddCors(options =>
            {
                options.AddPolicy(name: "_allowSpecificOrigins",
                    builder =>
                    {
                        builder.WithOrigins("localhost:4200", "http://localhost:4200").AllowAnyMethod().AllowAnyHeader().AllowCredentials();
                    });
            });


            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo { Title = "backend proiect", Version = "v1" });
                
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = @"JWT Authorization header using the Bearer scheme.
                      Enter your token in the text input below.",
                    Name = "Authorization", // name of the header
                    Type = SecuritySchemeType.Http,
                    In = ParameterLocation.Header,
                    Scheme = "Bearer",
                    BearerFormat = "JWT"
                });

                // The AddSecurityRequirement extension method will add an authorization header to each endpoint when the request is sent.
                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Name = "Bearer", // the security scheme
                            Reference = new OpenApiReference
                            {
                                Id = "Bearer",
                                Type = ReferenceType.SecurityScheme
                            },
                            In = ParameterLocation.Header
                            //Scheme = "oauth2"
                        },
                        new List<string>()
                    }
                });
            });


            //Edit here Connection String after creating a new local Database. This Connection String will not work on your PCs.
            services.AddDbContext<DatabaseContext>(options => options.UseSqlServer(@"Server=(localdb)\MSSQLLocalDB;Initial Catalog=backend;Integrated Security=True;Connect Timeout=30;ApplicationIntent=ReadWrite;"));
            //services.AddDbContext<backendContext>(options => options.UseSqlServer(@"Server=(localdb)\MSSQLLocalDB;Initial Catalog=backend;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False"));
            //services.AddDbContext<AppDbContext>(options => options.UseSqlServer(Configuration.GetConnectionString("SqlServerDbConnection")));


            services.AddIdentity<User, IdentityRole>(options => 
            {
                // Default Lockout settings.
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
                options.Lockout.MaxFailedAccessAttempts = 5;
                options.Lockout.AllowedForNewUsers = true;

                // Default Password settings.
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequireUppercase = true;
                options.Password.RequiredLength = 6;
                options.Password.RequiredUniqueChars = 1;

                // Default SignIn settings.
                options.SignIn.RequireConfirmedEmail = false;
                options.SignIn.RequireConfirmedPhoneNumber = false;

                options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_";
                options.User.RequireUniqueEmail = true;
            }).AddEntityFrameworkStores<DatabaseContext>();//.AddDefaultTokenProviders();

            //services.Configure<PasswordHasherOptions>(option =>
            //{
            //    option.IterationCount = 15000;
            //});


            // To carry out an authentication flow, you need at least one authentication handler that implements the IAuthenticationService interface.
            // The handlers are used by the authentication middleware. The registered authentication handlers and their configuration options are called "schemes".

            //services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme) // registers schemes them and their config settings
            //    .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options => Configuration.Bind("JwtSettings", options))
            //    .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options => Configuration.Bind("CookieSettings", options));
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme; 
            })
            .AddJwtBearer(options =>
            {
                options.SaveToken = true;
                options.RequireHttpsMetadata = true;

                //var key = Configuration.GetSection("Jwt").GetSection("SecretKey").Get<string>();
                var key = Configuration["JWT:SecretKey"];
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidAudience = Configuration["JWT:ValidAudience"],
                    ValidIssuer = Configuration["JWT:ValidIssuer"],
                    ValidateIssuerSigningKey = true,
                    ValidateLifetime = true,
                    RequireExpirationTime = true,
                    IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(key)),
                    ClockSkew = TimeSpan.Zero
                };

                options.Events = new JwtBearerEvents
                {
                    //OnAuthenticationFailed = context => {
                    //    if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
                    //        context.Response.Headers.Add("TOKEN-EXPIRED", "true");
                    //    return Task.CompletedTask;
                    //},

                    OnMessageReceived = context =>
                    {
                        if (context.Request.Cookies.ContainsKey("User_Access_Token"))
                            context.Token = context.Request.Cookies["User_Access_Token"];
                        return Task.CompletedTask;
                    }
                };
            });


            //services.AddAuthorization(opt =>
            //{
            //    opt.AddPolicy("User", policy => policy.RequireRole("User").RequireAuthenticatedUser().AddAuthenticationSchemes("AuthScheme").Build());
            //    opt.AddPolicy("Admin", policy => policy.RequireRole("Admin").RequireAuthenticatedUser().AddAuthenticationSchemes("AuthScheme").Build());
            //});


            /*
              services.AddTransient - new instance of the service for each class that injects it
              services.AddScoped - same instance of the service for the entire duration of the request
              services.AddSingleton - one single instance in the entire app
            */

            //services.AddSingleton<IJWTManagerRepository, JWTManagerRepository>();
            //services.AddScoped<IUserServiceRepository, UserServiceRepository>();

            services.AddTransient<IUsersRepository, UsersRepository>();
            services.AddTransient<IUsersManager, UsersManager>();

            services.AddTransient<ITokensManager, TokensManager>();
        }


        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "proiect v1"));
            }
            //else app.UseExceptionHandler("/Home/Error");

            app.UseCors("_allowSpecificOrigins"); // adds CORS middleware to the web app

            app.UseHttpsRedirection(); // adds middleware for redirecting HTTP requests to HTTPS

            app.UseRouting();

            app.UseAuthentication(); // authentication middleware

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}

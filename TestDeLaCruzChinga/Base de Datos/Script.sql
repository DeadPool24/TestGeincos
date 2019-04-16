USE [master]
GO
/****** Object:  Database [Geinco]    Script Date: 15/04/2019 22:12:45 ******/
CREATE DATABASE [Geinco]
GO
USE [Geinco]
GO
/****** Object:  StoredProcedure [dbo].[SpAddAlumno]    Script Date: 15/04/2019 22:12:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[SpAddAlumno]
@IdAlumno int output,
@Nombres varchar(30),
@ApellidoPat varchar(30),
@ApellidoMat varchar(30),
@Dni char(8),
@Correo varchar(100),
@Apoderado varchar(100),
@DniApoderado char(8),
@TelfonoEmergencia char(9),
@Nivel char(1),
@Seccion char(1),
@Estado bit
as

if not exists(select IdAlumno from Alumno where Dni=@Dni)
begin
	insert into Alumno (Nombres,ApellidoPat,ApellidoMat,Dni,Correo,Apoderado,DniApoderado,TelfonoEmergencia,Nivel,Seccion,Estado)
	values(@Nombres,@ApellidoPat,@ApellidoMat,@Dni,@Correo,@Apoderado,@DniApoderado,@TelfonoEmergencia,@Nivel,@Seccion,1)
	set @IdAlumno=@@IDENTITY
end
else
begin
RAISERROR ('El DNI ingresado ya esta siendo utilizado por otro alumno', 11,1)
end

GO
/****** Object:  StoredProcedure [dbo].[SpAddCurso]    Script Date: 15/04/2019 22:12:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[SpAddCurso]
@IdCurso int output,
@Descripcion varchar(30)
as
if not exists(select 1 from Curso where Descripcion=@Descripcion)
begin
	insert into Curso (Descripcion,Estado)
	values (@Descripcion,1)
	set @IdCurso=@@IDENTITY
end
else
raiserror('El curso ingresado ya esta registrado',11,1)
GO
/****** Object:  StoredProcedure [dbo].[SpAddCursoAlumno]    Script Date: 15/04/2019 22:12:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[SpAddCursoAlumno]
@IdCurso int,
@IdAlumno int
as
if not exists(select 1 from CursoAlumno where IdCurso=@IdCurso and IdAlumno=@IdAlumno and Estado=1)
begin
	insert into CursoAlumno (IdCurso,IdAlumno,Nota,Estado)
	values(@IdCurso,@IdAlumno,0,1)
end
else
begin
raiserror('El alumno ya esta registrado en el curso',11,1)
end
GO
/****** Object:  StoredProcedure [dbo].[SpDeleteAlumno]    Script Date: 15/04/2019 22:12:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[SpDeleteAlumno]
@IdAlumno int
as
update Alumno set Estado=0 where IdAlumno=@IdAlumno
GO
/****** Object:  StoredProcedure [dbo].[SpDeleteCurso]    Script Date: 15/04/2019 22:12:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[SpDeleteCurso]
@IdCurso int
as
update Curso set Estado=0
where IdCurso=@IdCurso
GO
/****** Object:  StoredProcedure [dbo].[SpDeleteCursoAlumno]    Script Date: 15/04/2019 22:12:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[SpDeleteCursoAlumno]
@IdAlumno int,
@IdCurso int
as
update CursoAlumno set Estado=0
where IdAlumno=@IdAlumno and IdCurso=@IdCurso
GO
/****** Object:  StoredProcedure [dbo].[SpFillAlumno]    Script Date: 15/04/2019 22:12:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[SpFillAlumno]
@IdAlumno int,
@Estado bit
as
select * from Alumno
where Estado=@Estado and (IdAlumno=@IdAlumno or @IdAlumno=0)
GO
/****** Object:  StoredProcedure [dbo].[SpFillCurso]    Script Date: 15/04/2019 22:12:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[SpFillCurso]
@IdCurso int,
@Estado bit
as
select * from Curso
where Estado=@Estado and (IdCurso=@IdCurso or @IdCurso=0)
GO
/****** Object:  StoredProcedure [dbo].[SpFillNotasPorAlumno]    Script Date: 15/04/2019 22:12:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[SpFillNotasPorAlumno]
@IdAlumno int
as
select 
c.IdCurso,c.Descripcion,a.IdAlumno,a.Nombres,a.ApellidoPat,a.ApellidoMat,ca.Nota
 from CursoAlumno ca
inner join Alumno a on a.IdAlumno=ca.IdAlumno
inner join Curso c on c.IdCurso=ca.IdCurso
where a.IdAlumno=@IdAlumno  and ca.estado=1
GO
/****** Object:  StoredProcedure [dbo].[SpGetNotasGeneral]    Script Date: 15/04/2019 22:12:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[SpGetNotasGeneral]
as
select 
c.IdCurso,c.Descripcion,a.IdAlumno,a.Nombres,a.ApellidoPat,a.ApellidoMat,ca.Nota
 from CursoAlumno ca
inner join Alumno a on a.IdAlumno=ca.IdAlumno
inner join Curso c on c.IdCurso=ca.IdCurso
where ca.estado=1
order by a.IdAlumno asc
GO
/****** Object:  StoredProcedure [dbo].[SpUpdateAlumno]    Script Date: 15/04/2019 22:12:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[SpUpdateAlumno]
@IdAlumno int output,
@Nombres varchar(30),
@ApellidoPat varchar(30),
@ApellidoMat varchar(30),
@Dni char(8),
@Correo varchar(100),
@Apoderado varchar(100),
@DniApoderado char(8),
@TelfonoEmergencia char(9),
@Nivel char(1),
@Seccion char(1)
as

update Alumno set Nombres=@Nombres,ApellidoPat=@ApellidoPat,ApellidoMat=@ApellidoMat,Dni=@Dni,Correo=@Correo,
Apoderado=@Apoderado,DniApoderado=@DniApoderado,TelfonoEmergencia=@TelfonoEmergencia,Nivel=@Nivel,Seccion=@Seccion
where IdAlumno=@IdAlumno
GO
/****** Object:  StoredProcedure [dbo].[spUpdateCurso]    Script Date: 15/04/2019 22:12:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[spUpdateCurso]
@IdCurso int,
@Descripcion varchar(30)
as
update Curso
set Descripcion=@Descripcion
where IdCurso=@IdCurso
GO
/****** Object:  StoredProcedure [dbo].[SpUpdateNotaAlumno]    Script Date: 15/04/2019 22:12:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[SpUpdateNotaAlumno]
@IdAlumno int,
@IdCurso int,
@Nota float
as
update CursoAlumno set Nota=@Nota
where IdAlumno=@IdAlumno and IdCurso=@IdCurso
GO
/****** Object:  Table [dbo].[Alumno]    Script Date: 15/04/2019 22:12:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Alumno](
	[IdAlumno] [int] IDENTITY(1,1) NOT NULL,
	[Nombres] [varchar](30) NULL,
	[ApellidoPat] [varchar](30) NULL,
	[ApellidoMat] [varchar](30) NULL,
	[Dni] [char](8) NULL,
	[Correo] [varchar](100) NULL,
	[Apoderado] [varchar](100) NULL,
	[DniApoderado] [varchar](8) NULL,
	[TelfonoEmergencia] [char](9) NULL,
	[Nivel] [char](1) NULL,
	[Seccion] [char](1) NULL,
	[Estado] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[IdAlumno] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Curso]    Script Date: 15/04/2019 22:12:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Curso](
	[IdCurso] [int] IDENTITY(1,1) NOT NULL,
	[Descripcion] [varchar](30) NULL,
	[Estado] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[IdCurso] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[CursoAlumno]    Script Date: 15/04/2019 22:12:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CursoAlumno](
	[IdCurso] [int] NULL,
	[IdAlumno] [int] NULL,
	[Nota] [float] NULL,
	[Estado] [bit] NULL
) ON [PRIMARY]

GO
ALTER TABLE [dbo].[CursoAlumno]  WITH CHECK ADD  CONSTRAINT [FK_CursoAlumno_Alumno] FOREIGN KEY([IdAlumno])
REFERENCES [dbo].[Alumno] ([IdAlumno])
GO
ALTER TABLE [dbo].[CursoAlumno] CHECK CONSTRAINT [FK_CursoAlumno_Alumno]
GO
ALTER TABLE [dbo].[CursoAlumno]  WITH CHECK ADD  CONSTRAINT [FK_CursoAlumno_Curso] FOREIGN KEY([IdCurso])
REFERENCES [dbo].[Curso] ([IdCurso])
GO
ALTER TABLE [dbo].[CursoAlumno] CHECK CONSTRAINT [FK_CursoAlumno_Curso]
GO
USE [master]
GO
ALTER DATABASE [Geinco] SET  READ_WRITE 
GO
